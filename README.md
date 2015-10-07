# ambari-web
This repository contains required modifications to ambari-web javascripts in order to deploy a keedio stack with ambari  

cp app.js /tmp/;gzip /tmp/app.js;cp -f /tmp/app.js.gz /usr/lib/ambari-server/web/javascripts/  
cp app.css /tmp/;gzip /tmp/app.css;cp -f /tmp/app.css.gz /usr/lib/ambari-server/web/stylesheets/  
cp -r app/assets/img/keedio /usr/lib/ambari-server/web/img/  
cp app/assets/font/* /usr/lib/ambari-server/web/font/  
cp app/assets/index.html /usr/lib/ambari-server/index.html  
cp /var/www/html/ambari-release-1.7.0/ambari-admin/src/main/resources/ui/admin-web/app/styles/main.css /var/lib/ambari-server/resources/views/work/ADMIN_VIEW{1.0.0}/styles/  
cp /var/www/html/ambari-release-1.7.0/ambari-admin/src/main/resources/ui/admin-web/app/index.html /var/lib/ambari-server/resources/views/work/ADMIN_VIEW\{1.0.0\}/ 
cp /var/www/html/ambari-release-1.7.0/ambari-admin/src/main/resources/ui/admin-web/app/views/main.html /var/lib/ambari-server/resources/views/work/ADMIN_VIEW\{1.0.0\}/views/  
cp /var/www/html/ambari-release-1.7.0/ambari-admin/src/main/resources/ui/admin-web/app/views/modals/AboutModal.html /var/lib/ambari-server/resources/views/work/ADMIN_VIEW\{1.0.0\}/views/modals/   
