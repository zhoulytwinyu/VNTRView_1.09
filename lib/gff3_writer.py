#!/usr/bin/env python3

def encode_gff3_attr_field(string):
  string = string.replace(";","%3B") \
                .replace("=","%3D") \
                .replace("&","%26") \
                .replace(",","%2C")
  return string

def encode_gff3_field(string):
  string = string.replace("\t","%09") \
                .replace("\n","%0A") \
                .replace("\r","%0D") \
                .replace("%","%25")
  return string

def records_to_gff3(records):
  """
  Write gff3 format (http://gmod.org/wiki/GFF3)
  first row comment: ##gff-version 3
  row format: seqid source type start end score strand phase attributes
  attribute format: ID=mrna0001;Name=sonichedgehog
  Not supported: list of attributes: AttrList=1,2,3
  """
  yield "##gff-version 3"
  for row in records:
    for key in row.keys():
      row[key]=str(row[key])
    row["attribute"]=[]
    for key in row.keys():
      if key not in ["seqid","source","type","start","end","score","strand","phase","attribute"]:
        row["attribute"].append("{}={}".format( encode_gff3_attr_field(key),
                                                encode_gff3_attr_field(row[key])
                                                )
                                )
    row["attribute"]=";".join(row["attribute"])
    yield row["seqid"]+"\t"+ \
          row["source"]+"\t"+ \
          row["type"]+"\t"+ \
          row["start"]+"\t"+ \
          row["end"]+"\t"+ \
          row["score"]+"\t"+ \
          row["strand"]+"\t"+ \
          row["phase"]+"\t"+ \
          row["attribute"]
