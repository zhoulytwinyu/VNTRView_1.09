SELECT COUNT(*) as count
  FROM (
    SELECT rid as Reference_ID,
      clusterid as Cluster_ID,
      (SELECT COUNT(map.readid)+1
        FROM map
        WHERE map.refid=rid
      ) Mapped_Read_Count,
      (SELECT COUNT(rank.readid)+1
        FROM rank
        WHERE rank.refid=rid
      ) RankBest_Read_Count,
      (SELECT COUNT(rankflank.readid)+1
        FROM rankflank
        WHERE rankflank.refid=rid
      ) FlankBest_Read_Count,
      reserved as VNTR_Copy_Diff,
      LENGTH(pattern) as Pattern_Size,
      (lastindex-firstindex+1) as Array_Length,
      copynum as Copy_Num,
      head as Chromosome,
      lastindex as Last_Index,
      firstindex as First_Index,
      (SELECT GROUP_CONCAT(  vntr_support.copies || "(" || support || ")"  )
        FROM vntr_support
        WHERE vntr_support.refid=rid
        ORDER BY vntr_support.copies
      ) Support,
      alleles_sup as Alleles_Supported,
      allele_sup_same_as_ref as Reference_Allele_Supported,
      is_singleton as Singleton,
      is_dist as Distinguishable,
      is_indist as Indistinguishable,
      comment as Comment,
      entropy as Entropy,
      conserved as Conserved,
      pattern as Pattern
      FROM fasta_ref_reps
        JOIN clusterlnk ON -fasta_ref_reps.rid=clusterlnk.repeatid
      {filter_string}
  )
;
