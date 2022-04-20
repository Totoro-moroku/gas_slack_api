import 'google-apps-script'

function myFunction() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = spreadsheet.getActiveSheet()
  var range = sheet.getRange('A1:A115').getValues()
  const value = range[Math.floor(Math.random() * range.length)]
  console.log(value)

  setProperties()

  changeSlackStatus(value[0])
}

function setProperties() {
  const properties = PropertiesService.getScriptProperties()
  properties.setProperties({
    slack_url: 'https://slack.com/api/',
    user_token: 'xoxp-590124786293-778610372180-3137505598016-f726e79919eb62fb37d101a6999496ac',
    user_id: 'UNWHYAY5A'
  })
  var animalSounds = properties.getProperties()

  for (var kind in animalSounds) {
    Logger.log('A %s goes %s!', kind, animalSounds[kind])
  }
}

function changeSlackStatus(emoji) {
  const properties = PropertiesService.getScriptProperties().getProperties()

  const slackSetStatusUrl = properties['slack_url'] + 'users.profile.set',
    user_token = properties['user_token'],
    user_id = properties['user_id']

  const headers = {
    Authorization: 'Bearer ' + user_token,
    'X-Slack-User': user_id,
    'COntent-Type': 'application/json; charset=utf-8'
  }

  const payload = {
    profile: {
      status_emoji: emoji,
      status_text: ''
    }
  }

  const options = {
    method: 'post',
    headers: headers,
    payload: JSON.stringify(payload)
  }

  const res = UrlFetchApp.fetch(slackSetStatusUrl, options)
  const resJson = JSON.parse(res.getContentText())
  console.log(JSON.stringify(resJson, false, 2))
}
