import * as Location from 'expo-location';

export class LocationService {
  static async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  }

  static async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      const result = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (result.length > 0) {
        const address = result[0];
        return `${address.street || ''} ${address.city || ''} ${address.region || ''}`.trim();
      }
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  }
}