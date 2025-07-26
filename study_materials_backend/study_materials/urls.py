from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TopicViewSet, StudyMaterialViewSet , generate_flash_cards

router = DefaultRouter()
router.register(r'topics', TopicViewSet)
router.register(r'materials', StudyMaterialViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generateFlash/', generate_flash_cards, name='generate_flash_cards'),
]
