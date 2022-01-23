import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type RouterService from '@ember/routing/router-service';

export default class DayRoute extends Route {
  @service declare router: RouterService;

  async beforeModel() {
    // For simplicity, always require a date
    // in the URL so we don't need to special case
    // the "default" URL

    // always local time
    let now = new Date();
    // "2022-01-23T19:09:32.296Z"
    let [day] = now.toISOString().split('T');

    this.router.transitionTo('day', day);
  }
}
