from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    # If an error occurred, reformat it into a strict enterprise structure
    if response is not None:
        response.data = {
            'error': True,
            'message': 'API Error Occurred',
            'details': response.data # The specific Zod/DRF validation failure
        }
    return response