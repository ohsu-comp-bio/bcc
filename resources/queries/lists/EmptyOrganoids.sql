SELECT Organoids.PrimaryInitiation,
Organoids.P6Initiation,
Organoids.PrimaryTumorCells
FROM Organoids
WHERE Organoids.P6Initiation IS NULL
OR Organoids.PrimaryTumorCells IS NULL