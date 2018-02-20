SELECT cid as Cluster_ID,
  repeatcount as Read_Count,
  refcount as Reference_Count,
  minpat as Min_Pattern_Size,
  maxpat as Max_Pattern_Size,
  (maxpat-minpat)*1.0/minpat as Pattern_Range,
  variability as VNTR_Count,
  assemblyreq as Assembly_Req,
  profdensity as Profile_Density,
  flankdensity as Flank_Density,
  aveentropy as Avg_Entropy,
  (SELECT COUNT(  NULLIF( TRIM(fasta_ref_reps.comment),"" )  )
    FROM clusterlnk
      JOIN fasta_ref_reps ON fasta_ref_reps.rid=-clusterlnk.repeatid
    WHERE clusterlnk.clusterid=cid
    GROUP BY clusterlnk.clusterid
  ) Comment_Count,
  mcpattern as Most_Commom_Pattern
  FROM clusters
  {filter_string}
  {order_string}
  LIMIT  {offset}, {page_size}
;
