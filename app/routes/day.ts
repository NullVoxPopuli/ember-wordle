import Route from '@ember/routing/route';

export default class DayRoute extends Route {
  async model(params: Record<string, unknown>) {
    return { day: params.day };
  }
}
