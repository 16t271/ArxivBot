function getChannelId(slackApp, channelName)
{
  var channelId = '';
  var result = slackApp.channelsList();
  if (result.ok) {
    for each(var channel in result.channels) {
      if (channel.name == channelName) {
        channelId = channel.id;
        break;
      }
    }
  }
  return channelId;
}

function pinsList(TOKEN, channelId){
  var index='https://slack.com/api/pins.list?';
  var token = 'token=' + TOKEN;
  var channel = '&channel=' + channelId;
  var url = index + token + channel + '&pretty=1';
  var response = UrlFetchApp.fetch(url)
  var items=JSON.parse(response).items;
  var tslist = []
  for (k in items){
    tslist.push(items[k].message.ts);
  }
  return tslist;
}

function cleanChannel(slackApp,TOKEN, channelName)
{
  var channelId = getChannelId(slackApp, channelName);
  if (channelId.length == 0) {
    return;
  }
  var pinlist = pinsList(TOKEN, channelId);
  var date = new Date();
  date.setDate(date.getDate()-7); // 1週間前を指定
  var timestamp = Math.round(date.getTime() / 1000) + '.000000';
  do {
    var optParams = {
      latest: timestamp,
      count: 100    // 取得するメッセージの数(pinの数の方が多い場合は消えなくなる)
    };
    var result = slackApp.channelsHistory(channelId, optParams);
    if (result.ok) {
      for each(var message in result.messages) {
        var pinflag = 'False';
        for each (var pin in pinlist){
          if (message.ts == pin){
            Logger.log(message.ts);
            pinflag = 'Ture';
          }
        }
        if (pinflag == 'False'){
        slackApp.chatDelete(channelId, message.ts);
        }
      }
    }
  } while (result.ok && result.has_more)
}

function cleanChannels()
{
  var sheet = SpreadsheetApp.getActiveSheet();
  var values = sheet.getDataRange().getValues();

  var channelNames = [];
  for (var i = 0; i < values.length; ++i) {
    channelNames.push(values[i][2].replace("#",""));
  }
  var TOKEN = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var slackApp = SlackApp.create(TOKEN);
  for each(var channelName in channelNames) {
    cleanChannel(slackApp, TOKEN, channelName);
  }
}
