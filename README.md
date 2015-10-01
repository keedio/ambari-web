# ambari-web
This repository contains required modifications to ambari-web javascripts in order to deploy a keedio stack with ambari

cp app.js /tmp/;gzip /tmp/app.js;cp -f /tmp/app.js.gz /usr/lib/ambari-server/web/javascripts/
