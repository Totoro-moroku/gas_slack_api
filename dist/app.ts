import 'google-apps-script'
import './types'

class SlackUser {
  private user_token: string
  private user_id: string
  public url: string

  user_profile: string[]

  constructor(user: UserToken, url: string) {
    this.user_token = user.token
    this.user_id = user.id
    this.url = url
    this.user_profile = ['users', 'profile']
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

  get UserProfile() {
    const api_point = this.user_profile.concat(['get'])
    const options: Object = {
      method: 'get',
      headers: this.Headers,
    }
    const response = UrlFetchApp.fetch(this.makeSlackAPIUrl(api_point), options)
    const resJson = JSON.parse(response.getContentText())
    return resJson.profile
  }

  setUserProfile(status: UserStatus) {
    const api_point = this.user_profile.concat(['set'])

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

  if (slack_api.UserProfile.status_text) return

  slack_api.setUserProfile({
    status_emoji: value[0],
    status_text: '',
  })
}
