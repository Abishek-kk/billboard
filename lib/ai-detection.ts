import { AIAnalysis } from '@/types';

// Mock AI detection service - In production, this would connect to actual AI services
export class AIDetectionService {
  static async analyzeImage(imageUri: string, location: { latitude: number; longitude: number }): Promise<AIAnalysis> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis results
    const mockAnalysis: AIAnalysis = {
      detected_violations: [],
      confidence_scores: {},
      permit_extracted: Math.random() > 0.3,
      permit_number: Math.random() > 0.3 ? `PRM-${Math.floor(Math.random() * 10000)}` : undefined,
      size_compliance: Math.random() > 0.2,
      location_compliance: Math.random() > 0.1,
      damage_detected: Math.random() > 0.7,
      privacy_processed: true
    };

    // Generate violations based on analysis
    if (!mockAnalysis.size_compliance) {
      mockAnalysis.detected_violations.push('oversized');
      mockAnalysis.confidence_scores['oversized'] = 0.85 + Math.random() * 0.15;
    }

    if (!mockAnalysis.location_compliance) {
      mockAnalysis.detected_violations.push('improper_location');
      mockAnalysis.confidence_scores['improper_location'] = 0.78 + Math.random() * 0.22;
    }

    if (mockAnalysis.damage_detected) {
      mockAnalysis.detected_violations.push('damaged');
      mockAnalysis.confidence_scores['damaged'] = 0.72 + Math.random() * 0.28;
    }

    if (!mockAnalysis.permit_extracted) {
      mockAnalysis.detected_violations.push('missing_permit');
      mockAnalysis.confidence_scores['missing_permit'] = 0.90 + Math.random() * 0.10;
    }

    if (Math.random() > 0.6) {
      mockAnalysis.detected_violations.push('unauthorized');
      mockAnalysis.confidence_scores['unauthorized'] = 0.80 + Math.random() * 0.20;
    }

    return mockAnalysis;
  }

  static async extractText(imageUri: string): Promise<string[]> {
    // Mock OCR results
    const mockTexts = [
      'COCA-COLA',
      'Visit our store',
      'Call 1-800-BILLBOARD',
      'PRM-2024-001',
      'Size: 14x48 ft'
    ];

    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockTexts.slice(0, Math.floor(Math.random() * mockTexts.length) + 1);
  }

  static calculateOverallConfidence(analysis: AIAnalysis): number {
    const scores = Object.values(analysis.confidence_scores);
    if (scores.length === 0) return 0.95; // High confidence for compliant billboards
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
}