from django.db import models

class Topic(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class StudyMaterial(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="materials")
    content = models.TextField()
    material_type = models.CharField(max_length=50, choices=[
        ('flashcard', 'Flashcard'),
        ('flowchart', 'Flowchart'),
        ('notes', 'Notes'),
    ])

    def __str__(self):
        return f"{self.material_type} for {self.topic.name}"
