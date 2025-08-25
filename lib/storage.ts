import AsyncStorage from '@react-native-async-storage/async-storage';

export class OfflineStorage {
  private static PENDING_REPORTS_KEY = 'pending_reports';

  static async savePendingReport(report: any): Promise<void> {
    try {
      const existing = await this.getPendingReports();
      const updated = [...existing, { ...report, id: Date.now().toString() }];
      await AsyncStorage.setItem(this.PENDING_REPORTS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving pending report:', error);
    }
  }

  static async getPendingReports(): Promise<any[]> {
    try {
      const stored = await AsyncStorage.getItem(this.PENDING_REPORTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting pending reports:', error);
      return [];
    }
  }

  static async clearPendingReports(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.PENDING_REPORTS_KEY);
    } catch (error) {
      console.error('Error clearing pending reports:', error);
    }
  }

  static async removePendingReport(reportId: string): Promise<void> {
    try {
      const existing = await this.getPendingReports();
      const filtered = existing.filter(report => report.id !== reportId);
      await AsyncStorage.setItem(this.PENDING_REPORTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing pending report:', error);
    }
  }
}