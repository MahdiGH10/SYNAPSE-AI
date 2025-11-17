import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { classifyDocument } from '@/lib/classifier';

// Smart email routing based on document classification
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { emailContent, emailSubject, attachments } = await request.json();

    // Classify email body
    const bodyClassification = await classifyDocument(emailContent, true);

    // Classify attachments if present
    let attachmentClassifications = [];
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        const classification = await classifyDocument(attachment.content, true);
        attachmentClassifications.push({
          filename: attachment.filename,
          classification,
        });
      }
    }

    // Determine routing based on classification
    const routing = getSmartRouting(
      bodyClassification.prediction || 'Unknown',
      attachmentClassifications
    );

    // Generate smart response suggestions
    const suggestions = getResponseSuggestions(
      bodyClassification.prediction || 'Unknown',
      emailContent
    );

    return NextResponse.json({
      success: true,
      classification: {
        body: bodyClassification,
        attachments: attachmentClassifications,
      },
      routing,
      suggestions,
    });
  } catch (error) {
    console.error('Email router error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getSmartRouting(category: string, attachments: any[]) {
  const routing = {
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    department: 'General',
    assignees: [] as string[],
    tags: [category],
    automatedActions: [] as string[],
  };

  switch (category) {
    case 'Financial Analysis':
      routing.priority = 'high';
      routing.department = 'Finance';
      routing.assignees = ['finance-team@company.com'];
      routing.tags.push('financial', 'requires-review');
      routing.automatedActions.push('Create audit trail', 'Schedule review meeting');
      break;

    case 'Technical Reports':
      routing.priority = 'high';
      routing.department = 'Engineering';
      routing.assignees = ['tech-lead@company.com'];
      routing.tags.push('technical', 'engineering');
      routing.automatedActions.push('Create technical ticket', 'Add to sprint backlog');
      break;

    case 'Business Documents':
      routing.priority = 'normal';
      routing.department = 'Business Operations';
      routing.assignees = ['business-ops@company.com'];
      routing.tags.push('business', 'strategic');
      routing.automatedActions.push('Add to document repository', 'Notify stakeholders');
      break;

    case 'Legal Documents':
      routing.priority = 'urgent';
      routing.department = 'Legal';
      routing.assignees = ['legal@company.com'];
      routing.tags.push('legal', 'confidential');
      routing.automatedActions.push('Apply encryption', 'Require e-signature');
      break;

    case 'Scientific Papers':
      routing.priority = 'normal';
      routing.department = 'Research';
      routing.assignees = ['research@company.com'];
      routing.tags.push('research', 'academic');
      routing.automatedActions.push('Add to research library', 'Extract citations');
      break;
  }

  // Adjust priority based on attachments
  if (attachments.length > 3) {
    routing.priority = routing.priority === 'normal' ? 'high' : routing.priority;
    routing.tags.push('multi-attachment');
  }

  return routing;
}

function getResponseSuggestions(category: string, content: string) {
  const suggestions = {
    quickReplies: [] as string[],
    templates: [] as { name: string; content: string }[],
    nextSteps: [] as string[],
  };

  switch (category) {
    case 'Financial Analysis':
      suggestions.quickReplies = [
        'Thank you for the financial report. Our team is reviewing it.',
        'We need additional clarification on the Q4 figures.',
        'The financial analysis has been forwarded to the CFO.',
      ];
      suggestions.templates.push({
        name: 'Financial Review Response',
        content: 'Thank you for submitting the financial analysis. Our finance team will review the documents and provide feedback within 2 business days. If you need urgent assistance, please contact finance@company.com.',
      });
      suggestions.nextSteps = [
        'Schedule finance review meeting',
        'Request additional supporting documents',
        'Forward to accounting for verification',
      ];
      break;

    case 'Technical Reports':
      suggestions.quickReplies = [
        'Technical report received. Engineering team notified.',
        'We\'ll review the technical details and get back to you.',
        'Creating a ticket for the engineering team.',
      ];
      suggestions.templates.push({
        name: 'Technical Review Response',
        content: 'Your technical report has been received and assigned to our engineering team. They will analyze the findings and respond with an action plan within 3-5 business days.',
      });
      suggestions.nextSteps = [
        'Create engineering ticket',
        'Assign to technical lead',
        'Schedule technical review session',
      ];
      break;

    case 'Business Documents':
      suggestions.quickReplies = [
        'Document received and filed appropriately.',
        'Thank you for sharing. We\'ll review and follow up.',
        'Adding this to our strategic planning documents.',
      ];
      suggestions.templates.push({
        name: 'Business Document Acknowledgment',
        content: 'Thank you for the business document. It has been added to our repository and relevant stakeholders have been notified. We\'ll incorporate this into our next strategy session.',
      });
      suggestions.nextSteps = [
        'Add to document management system',
        'Notify relevant stakeholders',
        'Schedule follow-up discussion',
      ];
      break;
  }

  return suggestions;
}
