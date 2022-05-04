import 'google-apps-script'
import './types'

class SlackUser {
  private user_token: string
  private user_id: string
  url: string
  users: string[]

  constructor(user: UserToken, url: string) {
    this.user_token = user.token
    this.user_id = user.id
    this.url = url
    this.users = ['users']
  }

  get Headers(): Object {
    return {
      Authorization: 'Bearer ' + this.user_token,
      'X-Slack-User': this.user_id,
      'Content-Type': 'application/json; charset=utf-8',
    }
  }

  makeSlackAPIUrl(api_url: string[]) {
    return [this.url, api_url.join('.')].join('')
  }

  makeOptions(method: string): Object {
    return { method: method, headers: this.Headers }
  }

  getSlackAPI(api: string[]) {
    const api_point = this.users.concat(api)
    const options: Object = {
      method: 'get',
      headers: this.Headers,
    }
    const response = UrlFetchApp.fetch(this.makeSlackAPIUrl(api_point), options)
    const resJson = JSON.parse(response.getContentText())

    return resJson
  }

  get UserProfile(): UserProfile {
    return this.getSlackAPI(['profile', 'get'])
  }

  get UserPresence(): UserPresence {
    return this.getSlackAPI(['getPresence'])
  }

  setUserProfile(status: UserStatus) {
    const api_point = this.users.concat(['profile', 'set'])

    const payload = {
      profile: status,
    }

    const options: Object = {
      method: 'post',
      headers: this.Headers,
      payload: JSON.stringify(payload),
    }

    UrlFetchApp.fetch(this.makeSlackAPIUrl(api_point), options)
  }
}

function getSlackProps(): { user: UserToken; url: string } {
  {
    const google_properties =
      PropertiesService.getScriptProperties().getProperties()

    return {
      user: {
        token: google_properties['user_token'],
        id: google_properties['user_id'],
      },
      url: google_properties['slack_url'],
    }
  }
}

function myFunction() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = spreadsheet.getActiveSheet()
  var range = sheet.getRange('A1:A115').getValues()

  const value: string[] = range[Math.floor(Math.random() * range.length)]
  console.log(value)

  const slack_props = getSlackProps()

  const slack_api = new SlackUser(
    {
      token: slack_props.user.token,
      id: slack_props.user.id,
    },
    slack_props.url
  )

  const user_profile = slack_api.UserProfile

  console.log(user_profile)

  if (user_profile.profile.status_text) return

  const user_presence = slack_api.UserPresence

  if (user_presence.presence === 'away') return

  slack_api.setUserProfile({
    status_emoji: value[0],
    status_text: '',
  })
}
