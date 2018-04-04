# VNTRView_1.09
VNTRView_1.09 is a standalone python wsgi web server for viewing VNTRSeek results.

# Dependencies
python3
python3-flask

# Optional Dependencies
apache2
apache2-mod-wsgi
(Refer to Install.md in folder "Apache_integration")

# Usage
VNTRView_1.09 can be run as a standalone, without apache.
Under this mode, VNTRSeek generated Sqlite3 databases should be put in folder "db". Start "server.py". Once running, you should be able to visit the website using your favorite browser at "http://localhost:5001"

VNTRView_1.09 can also be run behind apache.
To install the website behind apache, please refer to Install.md in folder "Apache_integration". The address for the website is dectated by apache's vhosts.conf.
