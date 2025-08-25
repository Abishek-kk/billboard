import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Camera, FlipHorizontal, Zap, MapPin, Loader } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { LocationService } from '@/lib/location';
import { AIDetectionService } from '@/lib/ai-detection';
import { OfflineStorage } from '@/lib/storage';

export default function CaptureScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <Camera size={64} color="#6B7280" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to capture billboard photos for compliance monitoring.
          </Text>
          <Button
            title="Grant Camera Permission"
            onPress={requestPermission}
            style={styles.permissionButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashMode(current => (current === 'off' ? 'on' : 'off'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsProcessing(true);

      // Get current location
      const location = await LocationService.getCurrentLocation();
      if (!location) {
        Alert.alert('Location Error', 'Unable to get current location. Please enable location services.');
        return;
      }

      // Take photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo) {
        Alert.alert('Error', 'Failed to capture photo');
        return;
      }

      // Request media library permission if not granted
      if (!mediaPermission?.granted) {
        const mediaPermResult = await requestMediaPermission();
        if (!mediaPermResult.granted) {
          Alert.alert('Permission Required', 'Media library access is needed to save photos.');
          return;
        }
      }

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      
      // Get address from coordinates
      const address = await LocationService.reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );

      // Run AI analysis
      const aiAnalysis = await AIDetectionService.analyzeImage(photo.uri, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      // Create violation report
      const violationReport = {
        photo_url: asset.uri,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address
        },
        ai_analysis: aiAnalysis,
        confidence_score: AIDetectionService.calculateOverallConfidence(aiAnalysis),
        timestamp: new Date().toISOString(),
        type: aiAnalysis.detected_violations[0] || 'potential_violation',
        description: `Potential billboard violation detected with ${Math.round(AIDetectionService.calculateOverallConfidence(aiAnalysis) * 100)}% confidence`
      };

      // Save offline first
      await OfflineStorage.savePendingReport(violationReport);

      Alert.alert(
        'Photo Captured!',
        `AI analysis complete. ${aiAnalysis.detected_violations.length > 0 ? 
          `${aiAnalysis.detected_violations.length} potential violation(s) detected` : 
          'No violations detected'}.`,
        [
          { text: 'View Report', onPress: () => {} },
          { text: 'Capture Another', style: 'cancel' }
        ]
      );

    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture and process photo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Billboard Scanner</Text>
        <View style={styles.locationIndicator}>
          <MapPin size={16} color="#059669" />
          <Text style={styles.locationText}>GPS Active</Text>
        </View>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flashMode}
        >
          <View style={styles.overlay}>
            <View style={styles.targetFrame}>
              <Text style={styles.targetText}>Align billboard within frame</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <View style={styles.topControls}>
              <Button
                title=""
                onPress={toggleFlash}
                style={[styles.controlButton, flashMode === 'on' && styles.activeControlButton]}
              >
                <Zap size={24} color={flashMode === 'on' ? '#EA580C' : '#FFFFFF'} />
              </Button>
              <Button
                title=""
                onPress={toggleCameraFacing}
                style={styles.controlButton}
              >
                <FlipHorizontal size={24} color="#FFFFFF" />
              </Button>
            </View>

            <View style={styles.bottomControls}>
              <Button
                title={isProcessing ? '' : 'Capture & Analyze'}
                onPress={takePicture}
                disabled={isProcessing}
                style={styles.captureButton}
              >
                {isProcessing ? (
                  <View style={styles.processingContainer}>
                    <Loader size={24} color="#FFFFFF" />
                    <Text style={styles.processingText}>Analyzing...</Text>
                  </View>
                ) : (
                  <Camera size={28} color="#FFFFFF" />
                )}
              </Button>
            </View>
          </View>
        </CameraView>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>Capture Tips</Text>
        <Text style={styles.instructionText}>
          • Ensure the entire billboard is visible{'\n'}
          • Capture permit numbers clearly{'\n'}
          • Take photos from multiple angles{'\n'}
          • AI will auto-detect violations
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#065F46',
    marginLeft: 4,
    fontWeight: '500',
  },
  cameraContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetFrame: {
    width: 280,
    height: 160,
    borderWidth: 3,
    borderColor: '#059669',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
  },
  targetText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  topControls: {
    position: 'absolute',
    top: -400,
    right: 0,
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeControlButton: {
    backgroundColor: 'rgba(234, 88, 12, 0.8)',
  },
  bottomControls: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingContainer: {
    alignItems: 'center',
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  instructions: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  permissionContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    paddingHorizontal: 24,
  },
});