from django.db import migrations
from django.contrib.auth import get_user_model

def create_admin_user(apps, schema_editor):
    User = get_user_model()
    # Check if admin user already exists to prevent duplicates
    if not User.objects.filter(username='admin').exists():
        print("[Migration] Creating default admin user (username: admin, password: password)...")
        # Create superuser so they can access admin dashboard
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='password'
        )
        print("[Migration] Default admin user successfully created.")
    else:
        print("[Migration] Admin user already exists. Skipping creation.")

    # Seed standard user for test credentials in the documentation report
    if not User.objects.filter(username='alphv').exists():
        print("[Migration] Creating default test user (username: alphv, password: pass1)...")
        User.objects.create_user(
            username='alphv',
            email='alphv@example.com',
            password='pass1'
        )
        print("[Migration] Default test user successfully created.")
    else:
        print("[Migration] Test user already exists. Skipping creation.")

def remove_admin_user(apps, schema_editor):
    User = get_user_model()
    User.objects.filter(username='admin').delete()
    User.objects.filter(username='alphv').delete()
    print("[Migration] Default users removed.")

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_admin_user, reverse_code=remove_admin_user),
    ]
