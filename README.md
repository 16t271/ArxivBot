# SlackBot
Arxivの論文をSlackに通知するBot

## 作成手順
1. Googleドライブ上でスプレッドシートを作成する．<br>
以下の表の仕様に従ってスプレッドシートに記述する．<br>

|bot名|URL |channel |
|---|---|---|
|Paper Bot|http://export.arxiv.org/rss/cs.CL?version=2.0|#Arxive|

2. 「ツール」を選択し，スクリプトエディタに移動<br>
3. 「リソース」→「ライブラリ」に以下のライブラリを追加する<br>

|library|key |version |Developper Mode |
|---|---|---|---|
|SlackApp|M3W5Ut3Q39AaIwLquryEPMwV62A3znfOO|22|OFF|
|Parser|M1lugvAXKKtUxn_vdAG9JZleS6DrsjUUV|7|ON|

4. Slack API TOKENを取得し，delete_message_before_7days.gsの「ファイル」→「プロジェクトのプロパティ」→「スクリプトのプロパティ」にSLACK_ACCESS_TOKENとして保存する．<br>
5. Botsを作成しAPIを取得する．mention.gsの「ファイル」→「プロジェクトのプロパティ」→「スクリプトのプロパティ」にBOT_TOKENとして保存する．<br>

|プロパティ |値 |
|---|---|
|SLACK_ACCESS_TOKEN|'xoxp-...'|
|BOT_TOKEN|'xoxb-...'|
6. - mention.gs
   - delete_message_before_7days.gs
   <br>をスクリプトエディタに記述し，実行する．<br>
