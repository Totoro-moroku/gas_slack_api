import 'google-apps-script'

function myFunction() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = spreadsheet.getActiveSheet()
  var range = sheet.getRange('A1:A115').getValues()

  const value = range[Math.floor(Math.random() * range.length)]
  console.log(value)

  const slack_props = getSlackProps()

  if (hasSlackStatusText(slack_props)) return

  changeSlackStatus(slack_props, value[0])
}

function getSlackProps() {
  const google_properties =
    PropertiesService.getScriptProperties().getProperties()

  const slack_user_token = google_properties['user_token'],
    slack_user_id = google_properties['user_id']

  const headers: Headers = {
    Authorization: 'Bearer ' + slack_user_token,
    'X-Slack-User': slack_user_id,
    'Content-Type': 'application/json; charset=utf-8',
  }

  const return_props = {
    headers: headers,
    getSlackUrl: getSlackUrl,
  }

  return return_props

  function getSlackUrl(add_path: string) {
    let slack_url = google_properties['slack_url']
    return [slack_url, add_path].join('')
  }
}

function hasSlackStatusText(props: SlackProps) {
  const url = props.getSlackUrl('users.profile.get')

  const options: Object = {
    method: 'get',
    headers: props.headers,
  }
  const response = UrlFetchApp.fetch(url, options)

  const resJson = JSON.parse(response.getContentText())

  const status_text: string = resJson.profile.status_text

  return status_text ? true : false
}

function changeSlackStatus(props: SlackProps, emoji: string) {
  const url = props.getSlackUrl('users.profile.set')

  const payload = {
    profile: {
      status_emoji: emoji,
      status_text: '',
    },
  }

  const options: Object = {
    method: 'post',
    headers: props.headers,
    payload: JSON.stringify(payload),
  }

  const res = UrlFetchApp.fetch(url, options)
  const resJson = JSON.parse(res.getContentText())
}

interface Headers {
  Authorization: string
  'X-Slack-User': string
  'Content-Type': string
}

interface SlackProps {
  headers: Headers
  getSlackUrl: Function
}
