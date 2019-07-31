function ArxivRecommend() {
 var TOKEN = PropertiesService.getScriptProperties().getProperty('BOT_TOKEN');
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheets()[0];
 var data = sheet.getRange(1, 1, sheet.getLastRow(), 4).getValues();

 for (var i = 0; i < data.length; i++) {
   var keyword = data[i][0];    // botname
   var feedURL = data[i][1];    // url
   var channel = data[i][2];    // channel
   var lastFetched = data[i][3];    //??

   // Fetch
   try {
     var rssText = UrlFetchApp.fetch(feedURL).getContentText();
   } catch (e) {
     continue;
   }

   // Parse
   var items = Parser.data(rssText).from('<item>').to('</item>').iterate();

   var news = [];
   for each(var item in items) {
     if (lastFetched.indexOf(Parser.data(item).from('guid isPermaLink="false">').to('</guid>'))) {
       news.push(item);
     }
   }

   if (news.length > 0) {
     var date = new Date();
     var today = Utilities.formatDate(date, 'Asia/Tokyo', 'MM/dd')
     var app = SlackApp.create(TOKEN);
     var startmessage = 'There are ＊"' + news.length + '"＊ papers about ＊"' + keyword + '"＊ :eyes:';
     app.postMessage(channel, startmessage, {
         username: 'オラオラオラァ',
         icon_emoji: ':punch:',
     });
     date.setDate()
     var req = /\(.+\)/;
     var req1 = /&lt.*&gt;/;
     var count = 1;
     for each(var item in news) {
       var att = [];
       var title_more = Parser.data(item).from('<title>').to('</title>').build();
       var title = title_more.replace(req,'');
       var link = Parser.data(item).from('<link>').to('</link>').build();
       var desc = Parser.data(item).from('<description>').to('</description>').build();
       var description = desc.replace(/&lt.*&gt;/g,'');
       description = description.replace('\n','');
       description = description.replace('.','.\n');
       var translatedtitle = LanguageApp.translate(title, "en", "ja");
       var translateddesc = LanguageApp.translate(description, "en", "ja");
       att.push({
         title: title + '\n' + translatedtitle,
         title_link: link,
         text: description + translateddesc,
       });
       var message = ' Paper ＊"' + count + '"＊ on ' + today;
       app.postMessage(channel, message, {
         username: 'オラオラオラァ',
         icon_emoji: ':punch:',
         attachments: JSON.stringify(att),
       });
       count++;
     }
   }
 }
}
