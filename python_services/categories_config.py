# Document Classifier Category Configuration
#
# This file contains the mapping between numeric predictions and category names.
# Update the category names below to match your trained model's labels.
#
# Format: category_id = "Category Name"

CATEGORIES = {
    # Update these based on your actual document categories
    '0': 'Business Documents',
    '1': 'Technical Reports',
    '2': 'Financial Analysis',  # This is what the model predicted in your screenshot
    '3': 'Scientific Papers',
    '4': 'Medical Records',
    '5': 'Legal Documents',
    '6': 'Marketing Materials',
    '7': 'Research Papers',
    '8': 'News Articles',
    '9': 'Educational Content',
}

# Example categories for different domains:
#
# For News Classification:
# '0': 'Politics'
# '1': 'Sports'
# '2': 'Technology'
# '3': 'Entertainment'
# '4': 'Business'
#
# For Email Classification:
# '0': 'Spam'
# '1': 'Personal'
# '2': 'Work'
# '3': 'Promotions'
# '4': 'Social'
#
# For Customer Support:
# '0': 'Technical Issue'
# '1': 'Billing Question'
# '2': 'Product Inquiry'
# '3': 'Feature Request'
# '4': 'Bug Report'
