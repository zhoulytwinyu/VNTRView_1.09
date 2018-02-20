SELECT rid,
  flankleft,
  sequence,
  flankright,
  pattern,
  head,
  firstindex,
  lastindex,
  direction
  FROM fasta_ref_reps
  JOIN clusterlnk ON -rid=repeatid
  WHERE rid={reference_id}
