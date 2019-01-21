import BaseController from '../classes/BaseController';
export default class extends BaseController {
  indexAction() {
    return this.display();
  }
}
