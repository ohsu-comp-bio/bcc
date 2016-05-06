SELECT
v.OPTR,
count(*) as totalVariants,
SUM(CASE WHEN v.type = 'Missense' THEN 1 ELSE 0 END) as totalMissenseVariants


FROM study.variants v
GROUP BY v.OPTR