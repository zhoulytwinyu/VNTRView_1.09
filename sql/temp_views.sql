CREATE TEMP VIEW IF NOT EXISTS best_by_profile_map(refid,readid,pscore)
AS
  SELECT refid,readid,score as pscore
    FROM rank
    GROUP BY readid
    HAVING pscore = MAX(pscore)
;
CREATE TEMP VIEW IF NOT EXISTS best_by_flank_map(refid,readid,fscore)
AS
  SELECT refid,readid,score as fscore
    FROM rankflank
    GROUP BY readid
    HAVING fscore = MAX(fscore)
;
CREATE TEMP VIEW IF NOT EXISTS best_by_both_map(refid,readid,pscore,fscore)
AS
  SELECT refid,readid,rank.score as pscore,rankflank.score as fscore
    FROM rank
      JOIN rankflank USING (refid,readid)
    GROUP BY readid
    HAVING pscore=MAX(pscore)
      AND fscore=MAX(fscore)
;
