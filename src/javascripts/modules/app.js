/**
 *  Example app
 **/

import I18n from '../../javascripts/lib/i18n'
import { resizeContainer, render } from '../../javascripts/lib/helpers'
import getDefaultTemplate from '../../templates/default'

const MAX_HEIGHT = 1000
const API_ENDPOINTS = {
  organizations: '/api/v2/organizations.json'
}

class App {
  constructor (client, appData) {
    this._client = client
    this._appData = appData

    this.states = {}

    // this.initializePromise is only used in testing
    // indicate app initialization (including all async operations) is complete
    this.initializePromise = this.init()
  }

  /**
   * Initialize module, render main template
   */
  async init () {
    const currentUser = (await this._client.get('currentUser')).currentUser
    this.states.currentUserName = currentUser.name

    I18n.loadTranslations(currentUser.locale)

    const organizations = await this._client
      .request(API_ENDPOINTS.organizations)
      .catch(this._handleError.bind(this))

    if (organizations) {
      this.states.organizations = organizations.organizations

      // render application markup
      render('.loader', getDefaultTemplate(this.states))

      return resizeContainer(this._client, MAX_HEIGHT)
    }
  }

  /**
   * Handle error
   * @param {Object} error error object
   */
  _handleError (error) {
    console.log('An error is handled here: ', error.message)
  }
}

export default App
