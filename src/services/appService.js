export default class AppService {
  static getStatusClass(status) {
    switch (status) {
      case 'new':
        return 'status-info';

      case 'in progres':
        return 'status-warning';

      case 'approved':
        return 'status-success';

      case 'rejected':
        return 'status-error';

      case 'needs correction':
        return 'status-warning';

      case 'draft':
        return 'status-secondary';
    }
  }
}
