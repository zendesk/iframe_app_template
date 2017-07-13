import Franc from 'franc';
import View from 'view';
import Storage from 'storage';
import I18n from 'i18n';

const MAX_HEIGHT = 375;

class TicketSidebar {
  constructor(client, data) {
    this.client = client;
    this._metadata = data.metadata;
    this._context = data.context;

    this.storage = new Storage(this._metadata.installationId);
    this.view = new View({ afterRender: () => {
      let newHeight = Math.min($('html').height(), MAX_HEIGHT);
      this.client.invoke('resize', { height: newHeight, width: '100%' });
    }});

    this.getLanguages().then(this.renderMain.bind(this));

    this.view.switchTo('loading');
  }

  getLanguages() {
    return this.client.get(['ticket.requester.locale', 'ticket.description']).then(function(data) {
      data["ticket.description.language"] = I18n.t(Franc(data["ticket.description"]));
      data["ticket.requester.language"] = I18n.t(data["ticket.requester.locale"]);
      return data
    });
  }

  renderMain(data) {
    this.view.switchTo('main', data);
  }
}

export default TicketSidebar;
