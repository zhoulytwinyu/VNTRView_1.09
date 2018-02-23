#!/usr/bin/env python3
from flask import Flask,request,send_file,jsonify,render_template,redirect, make_response
from collections import deque
import sqlite3
import os
import io
import sys
import subprocess
import tempfile
from lib import gff3_writer
##################################SET UP################################
SCRIPT_DIR=os.path.dirname(os.path.realpath(__file__))

os.environ["PATH"]=os.environ["PATH"]+":"+os.path.join(SCRIPT_DIR,"bin")

# Make temp folder
TMP_FOLDER=os.path.join(SCRIPT_DIR,"tmp")
try:
  os.mkdir(TMP_FOLDER)
except FileExistsError as e:
  assert os.path.isdir(TMP_FOLDER)
  pass

DB_FOLDER=os.path.join(SCRIPT_DIR,"db")

app=Flask(__name__)

###############################END SET UP###############################

############################Helper functions############################
def parse_order_string(string):
  string=string.strip()
  if string=="":
    return ""
  else:
    return "ORDER BY "+string

def parse_filter_string(string):
  string=string.strip()
  if string=="":
    return ""
  else:
    return "WHERE "+string

def read_file(file_name):
  f=open(file_name,'r')
  content=f.read()
  f.close()
  return content

def reads_to_fasta(reads,fh):
  lw=60
  for read in reads:
    fh.write(">")
    fh.write(read["name"])
    fh.write("\n")
    seq=read["sequence"]
    length=len(seq)
    for i in range(0,1+length//lw):
      fh.write(seq[i*lw:(i+1)*lw])
      fh.write("\n")

def connection_cache(function):
  limit=10
  conn_list=deque([])
  conn_dict={}
  def new_function(database):
    if database in conn_dict:
      conn_list.remove(database)
      conn_list.append(database)
      return conn_dict[database]
    else: #database not in conn_dict
      #add new conn
      conn=function(database)
      conn_list.append(database)
      conn_dict[database]=conn
      while len(conn_list)>limit:
        #remove old conn
        popped_db=conn_list.popleft()
        conn_dict[popped_db].close()
        conn_dict.pop(popped_db)
      return conn
  return new_function

@connection_cache
def connect_to_db(database):
  if (not os.path.isfile(database)):
    raise FileNotFoundError
  conn=sqlite3.connect(database)
  conn.row_factory=sqlite3.Row
  cursor=conn.cursor()
  conn.commit()
  return conn
##########################END Helper functions##########################

################################Webpages################################
@app.route("/")
def homepage():
  return render_template("homepage.html")

@app.route("/<database>")
def db_page(database):
  return redirect("/{database}/stats".format(database=database),
                  code=302)

@app.route("/<database>/stats")
def stats_page(database):
  return render_template( "db_stats.html",
                          database=database)

@app.route("/<database>/cluster")
def cluster_page(database):
  return render_template( "cluster.html",
                          database=database)

@app.route("/<database>/reference")
def reference_page(database):
  return render_template( "reference.html",
                          database=database)

@app.route("/<database>/alignment")
def alignment_page(database):
  return render_template( "alignment.html",
                          database=database)

############################RESTFul backend#############################
@app.route("/restful/listdb")
def restful_listdb():
  """
  Return a list of databases in DB_FOLDER ending with ".db"
  Expect no query string
  """
  dbs=os.listdir(DB_FOLDER)
  dbs=[{"name":db[0:-3]} for db in dbs if db.endswith(".db")]
  return jsonify(dbs)

_stats_sql=read_file(os.path.join(SCRIPT_DIR,"sql","stats.sql"))
@app.route("/restful/<database>/stats")
def restful_stats(database):
  """
  Return stats
  Expect no query string
  """
  try:
    conn=connect_to_db(os.path.join(DB_FOLDER,database+".db"))
  except FileNotFoundError as e:
    return 'Database not found.', 404
  cur=conn.cursor()
  cur.execute(_stats_sql)
  ret=cur.fetchone()
  ret=dict(ret)
  return jsonify(ret)

_cluster_sql=read_file(os.path.join(SCRIPT_DIR,"sql","cluster.sql"))
@app.route("/restful/<database>/cluster")
def restful_cluster(database):
  """
  Return clusters
  Expect page, page_size, order_string, filter_string from query string
  """
  page=request.args.get("page",1,type=int)
  page_size=request.args.get("page_size",1000,type=int)
  order_string=request.args.get("order","").strip()
  filter_string=request.args.get("filter","").strip()
  order_string=order_string if order_string=="" else "ORDER BY "+order_string
  filter_string=filter_string if filter_string=="" else "WHERE "+filter_string
  sql=_cluster_sql
  sql=sql.format(filter_string=filter_string,
                 order_string=order_string,
                 offset=(page-1)*page_size,
                 page_size=page_size)
  try:
    conn=connect_to_db(os.path.join(DB_FOLDER,database+".db"))
  except FileNotFoundError as e:
    return 'Database not found.', 404
  cur=conn.cursor()
  try:
    cur.execute(sql)
  except sqlite3.OperationalError as e:
    print(sql,sys.stderr)
    return 'SQL error.', 500
  ret=cur.fetchall()
  ret=[dict(row) for row in ret]
  return jsonify(ret)

_cluster_count_sql=read_file(os.path.join(SCRIPT_DIR,"sql","cluster_count.sql"))
@app.route("/restful/<database>/cluster_count")
def restful_cluster_count(database):
  """
  Return number of clusters
  Expect filter_string from query string
  """
  filter_string=request.args.get("filter","").strip()
  filter_string=filter_string if filter_string=="" else "WHERE "+filter_string
  sql=_cluster_count_sql
  sql=sql.format(filter_string=filter_string)
  try:
    conn=connect_to_db(os.path.join(DB_FOLDER,database+".db"))
  except FileNotFoundError as e:
    return 'Database not found.', 404
  cur=conn.cursor()
  try:
    cur.execute(sql)
  except sqlite3.OperationalError as e:
    print(sql,sys.stderr)
    return 'SQL error.', 500
  ret=cur.fetchone()
  ret=dict(ret)
  return jsonify(ret)

_reference_sql=read_file(os.path.join(SCRIPT_DIR,"sql","reference.sql"))
@app.route("/restful/<database>/reference")
def restful_reference(database):
  """
  Return references
  Expect page, page_size, order_string, filter_string from query string
  """
  page=request.args.get("page",1,type=int)
  page_size=request.args.get("page_size",1000,type=int)
  order_string=request.args.get("order","").strip()
  filter_string=request.args.get("filter","").strip()
  order_string=order_string if order_string=="" else "ORDER BY "+order_string
  filter_string=filter_string if filter_string=="" else "WHERE "+filter_string
  sql=_reference_sql
  sql=sql.format(filter_string=filter_string,
                 order_string=order_string,
                 offset=(page-1)*page_size,
                 page_size=page_size)
  try:
    conn=connect_to_db(os.path.join(DB_FOLDER,database+".db"))
  except FileNotFoundError as e:
    return 'Database not found.', 404
  cur=conn.cursor()
  try:
    cur.execute(sql)
  except sqlite3.OperationalError as e:
    print(sql,sys.stderr)
    return 'SQL error.', 500
  ret=cur.fetchall()
  ret=[dict(row) for row in ret]
  return jsonify(ret)

_reference_to_gff3_sql=read_file(os.path.join(SCRIPT_DIR,"sql","reference_to_gff3.sql"))
@app.route("/restful/<database>/reference/gff")
def restful_reference_gff(database):
  """
  Return references as gff3 format
  Expect order_string, filter_string from query string
  """
  filter_string=request.args.get("filter","").strip()
  filter_string=filter_string if filter_string=="" else "WHERE "+filter_string
  sql=_reference_to_gff3_sql
  sql=sql.format(filter_string=filter_string)
  try:
    conn=connect_to_db(os.path.join(DB_FOLDER,database+".db"))
  except FileNotFoundError as e:
    return 'Database not found.', 404
  cur=conn.cursor()
  try:
    cur.execute(sql)
  except sqlite3.OperationalError as e:
    print(sql,sys.stderr)
    return 'SQL error.', 500
  rec=cur.fetchall()
  rec=[{"seqid":row["seqid"],
        "source":row["source"],
        "type":row["type"],
        "start":row["start"],
        "end":row["end"],
        "score":row["score"],
        "strand":row["strand"],
        "phase":row["phase"],
        "ID":row["ID"],
        "DB":database
        }
        for row in rec]
  response=make_response("\n".join(gff3_writer.records_to_gff3(rec)
                                    )
                          )
  response.headers["Content-Type"]="text/plain"
  response.headers["Content-Disposition"]="""attachment; filename="{}-filter_{}.gff" """.format(database,
                                                                                                filter_string \
                                                                                                  .replace('\'','') \
                                                                                                  .replace('=','_')
                                                                                                )
  return response

_reference_count_sql=read_file(os.path.join(SCRIPT_DIR,"sql","reference_count.sql"))
@app.route("/restful/<database>/reference_count")
def restful_reference_count(database):
  """
  Return number of clusters
  Expect filter_string from query string
  """
  filter_string=request.args.get("filter","").strip()
  filter_string=filter_string if filter_string=="" else "WHERE "+filter_string
  sql=_reference_count_sql
  sql=sql.format(filter_string=filter_string)
  try:
    conn=connect_to_db(os.path.join(DB_FOLDER,database+".db"))
  except FileNotFoundError as e:
    return 'Database not found.', 404
  cur=conn.cursor()
  try:
    cur.execute(sql)
  except sqlite3.OperationalError as e:
    print(sql,sys.stderr)
    return 'SQL error.', 500
  ret=cur.fetchone()
  ret=dict(ret)
  return jsonify(ret)

_reference_sequence_sql=read_file(os.path.join(SCRIPT_DIR,"sql","reference_sequence.sql"))
_mapped_reads_mapped_sql=read_file(os.path.join(SCRIPT_DIR,"sql","mapped_reads.mapped.sql"))
_mapped_reads_profile_sql=read_file(os.path.join(SCRIPT_DIR,"sql","mapped_reads.profile.sql"))
_mapped_reads_flank_sql=read_file(os.path.join(SCRIPT_DIR,"sql","mapped_reads.flank.sql"))
_mapped_reads_both_sql=read_file(os.path.join(SCRIPT_DIR,"sql","mapped_reads.both.sql"))
_mapped_reads_sql={ "mapped":_mapped_reads_mapped_sql,
                    "profile":_mapped_reads_profile_sql,
                    "flank":_mapped_reads_flank_sql,
                    "both":_mapped_reads_both_sql
                    }
@app.route("/restful/<database>/fasta")
def restful_get_fasta(database):
  """
  Return reference and reads sequences in fasta
  Expect reference_id, criteria, maxrepr
  """
  reference_id=request.args.get("ref",0,type=int)
  criteria=request.args.get("criteria","both")
  maxrepr=request.args.get("maxrepr",20,type=int)
  #Prepare
  fh=tempfile.NamedTemporaryFile(mode='w',dir=TMP_FOLDER,delete=False)
  ref_sql=_reference_sequence_sql
  read_sql=_mapped_reads_sql.get(criteria,"")
  ref_sql=ref_sql.format(reference_id=reference_id)
  read_sql=read_sql.format(reference_id=reference_id,limit="LIMIT {}".format(maxrepr))
  try:
    conn=connect_to_db(os.path.join(DB_FOLDER,database+".db"))
  except FileNotFoundError as e:
    return "Database not found.", 404
  cur=conn.cursor()
  #Fetch sequence from db
  try:
    cur.execute(ref_sql)
  except sqlite3.OperationalError as e:
    print(ref_sql,sys.stderr)
    return "SQL error.", 500
  ref=cur.fetchone()
  if ref is None:
    return "Reference repeat not found." ,500
  try:
    cur.execute(read_sql)
  except sqlite3.OperationalError as e:
    print(read_sql,sys.stderr)
    return 'SQL error.', 500
  reads=cur.fetchall()
  reads=[ref]+reads
  reads=[{"name":"gnl|{database}|{ID}|{Info}".format( database=database,
                                                      ID=read["ID"],
                                                      Info=read["Info"]
                                                      ),
          "sequence":read["Sequence"]
          }
          for read in reads
          ]
  reads_to_fasta(reads,fh)
  fh.close()
  #Return results
  response=make_response( send_file(fh.name,
                                    mimetype="text/plain",
                                    as_attachment=True,
                                    attachment_filename="{}-{}-{}.fasta".format(database,reference_id,criteria)
                                    )
                          )
  os.remove(fh.name)
  return response

_reference_align_format_sql=read_file(os.path.join(SCRIPT_DIR,"sql","reference_align_format.sql"))
_mapped_reads_align_format_mapped_sql=read_file(os.path.join(SCRIPT_DIR,"sql","mapped_reads_align_format.mapped.sql"))
_mapped_reads_align_format_profile_sql=read_file(os.path.join(SCRIPT_DIR,"sql","mapped_reads_align_format.profile.sql"))
_mapped_reads_align_format_flank_sql=read_file(os.path.join(SCRIPT_DIR,"sql","mapped_reads_align_format.flank.sql"))
_mapped_reads_align_format_both_sql=read_file(os.path.join(SCRIPT_DIR,"sql","mapped_reads_align_format.both.sql"))
_mapped_reads_align_format_sql={ "mapped":_mapped_reads_align_format_mapped_sql,
                    "profile":_mapped_reads_align_format_profile_sql,
                    "flank":_mapped_reads_align_format_flank_sql,
                    "both":_mapped_reads_align_format_both_sql
                    }
@app.route("/restful/<database>/alignment")
def restful_get_alignment(database):
  """
  Return reference and reads alignment in png
  Expect reference_id, criteria, maxrepr
  """
  reference_id=request.args.get("ref",0,type=int)
  criteria=request.args.get("criteria","both")
  maxrepr=request.args.get("maxrepr",20,type=int)
  #Prepare
  fh=tempfile.NamedTemporaryFile(mode='w',dir=TMP_FOLDER,delete=False)
  ref_sql=_reference_align_format_sql
  read_sql=_mapped_reads_align_format_sql.get(criteria,"")
  ref_sql=ref_sql.format(reference_id=reference_id)
  read_sql=read_sql.format(reference_id=reference_id,limit="LIMIT {}".format(maxrepr))
  try:
    conn=connect_to_db(os.path.join(DB_FOLDER,database+".db"))
  except FileNotFoundError as e:
    return "Database not found.", 404
  cur=conn.cursor()
  #Fetch sequence from db
  try:
    cur.execute(ref_sql)
  except sqlite3.OperationalError as e:
    print(ref_sql,sys.stderr)
    return "SQL error.", 500
  ref=cur.fetchone()
  if ref is None:
    return "Reference repeat not found." ,500
  try:
    cur.execute(read_sql)
  except sqlite3.OperationalError as e:
    print(read_sql,sys.stderr)
    return 'SQL error.', 500
  reads=cur.fetchall()
  data=[list(ref)]+[[i]+list(read) for i,read in enumerate(reads,2)]
  data=[','.join(map(str,l)) for l in data]
  fh.write('\n'.join(data))
  fh.close()
  #Return results
  aln=subprocess.run(["aln",fh.name,"0","1",str(maxrepr),"vntrview"],stdout=subprocess.PIPE)
  response=make_response(aln.stdout)
  response.headers["Content-Type"]="image/png"
  response.headers["Content-Disposition"]="""attachment; filename="{}-{}-{}.png" """.format(database,reference_id,criteria)
  os.remove(fh.name)
  return response

############################RESTFul backend#############################

app.config['TEMPLATES_AUTO_RELOAD'] = True
app.run(host="0.0.0.0",port=5001)
