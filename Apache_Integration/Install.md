# Install wsgi2 mod for apache
 Excerpt from [http://flask.pocoo.org/docs/0.12/deploying/mod_wsgi/](http://flask.pocoo.org/docs/0.12/deploying/mod_wsgi/):

If you are using Ubuntu/Debian you can apt-get it and activate it as follows:

`apt-get install libapache2-mod-wsgi`

If you are using a yum based distribution (Fedora, OpenSUSE, etc..) you can install it as follows:

`yum install mod_wsgi`

On FreeBSD install mod_wsgi by compiling the www/mod_wsgi port or by using pkg_add:

`pkg install ap22-mod_wsgi2`

# Configure virtual host
Copy the content of VNTRView_1.09.conf into apache vhosts.conf.
Adjust the script where appropriate.

# Expose flask wsgi server for apache
Copy VNTRView_1.09.wsgi to /var/www/VNTRView_1.09/VNTRView_1.09.wsgi or wherever VNTRView_1.09.conf points to (section WSGIScriptAlias)
Adjust the script where appropriate.
