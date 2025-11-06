from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import IntegrityError
from .models import CarMake, CarModel

def initiate():
    try:
        # Clear existing data to avoid duplication
        CarModel.objects.all().delete()
        CarMake.objects.all().delete()

        # Create Car Makes
        make1 = CarMake.objects.create(name="Toyota", description="Reliable and efficient Japanese car manufacturer")
        make2 = CarMake.objects.create(name="Ford", description="American brand known for trucks and muscle cars")
        make3 = CarMake.objects.create(name="BMW", description="Luxury German automaker known for performance")

        # Create Car Models
        CarModel.objects.create(make=make1, name="Corolla", type="Sedan", year=2020)
        CarModel.objects.create(make=make1, name="RAV4", type="SUV", year=2022)
        CarModel.objects.create(make=make2, name="Mustang", type="Sedan", year=2021)
        CarModel.objects.create(make=make2, name="F-150", type="SUV", year=2023)
        CarModel.objects.create(make=make3, name="X5", type="SUV", year=2022)
        CarModel.objects.create(make=make3, name="3 Series", type="Sedan", year=2019)

        print("Database populated successfully!")

    except IntegrityError:
        print("Error: Could not populate database due to integrity issue.")
    except Exception as e:
        print(f"Error during population: {e}")
