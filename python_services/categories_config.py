# Document Classifier Category Configuration
#
# This file contains the mapping between numeric predictions and category names.
# These categories match the trained doc_classifier.pkl model.
#
# Format: category_id = "Category Name"

CATEGORIES = {
    # Current model categories (AG News dataset)
    '0': 'World',        # World news and international affairs
    '1': 'Sports',       # Sports news and events
    '2': 'Business',     # Business, finance, and economics
    '3': 'Sci/Tech',     # Science and technology news
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
