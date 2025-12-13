import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { classifyDocument } from '@/lib/classifier';

interface DocumentWorkspace {
  id: string;
  name: string;
  category: string;
  documents: Array<{
    id: string;
    name: string;
    content: string;
    classification: {
      category: string;
      confidence: number;
      probabilities: Record<string, number>;
    };
    createdAt: Date;
    tags: string[];
  }>;
  stats: {
    totalDocuments: number;
    categoryDistribution: Record<string, number>;
    averageConfidence: number;
  };
}

// In-memory storage (replace with MongoDB in production)
const workspaces = new Map<string, DocumentWorkspace[]>();

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);
    const userId = decoded.id;

    const { action, workspaceId, documentName, documentContent } = await request.json();

    // Get or create user workspaces
    if (!workspaces.has(userId)) {
      workspaces.set(userId, []);
    }
    const userWorkspaces = workspaces.get(userId)!;

    switch (action) {
      case 'add-document': {
        // Classify the document
        const classification = await classifyDocument(documentContent, true);
        
        if (!classification.success) {
          return NextResponse.json({ error: 'Classification failed' }, { status: 500 });
        }

        // Find or create workspace for this category
        let workspace = userWorkspaces.find(w => w.category === classification.prediction);
        
        if (!workspace) {
          workspace = {
            id: `ws-${Date.now()}`,
            name: `${classification.prediction} Workspace`,
            category: classification.prediction!,
            documents: [],
            stats: {
              totalDocuments: 0,
              categoryDistribution: {},
              averageConfidence: 0,
            },
          };
          userWorkspaces.push(workspace);
        }

        // Add document to workspace
        const document = {
          id: `doc-${Date.now()}`,
          name: documentName,
          content: documentContent,
          classification: {
            category: classification.prediction!,
            confidence: classification.confidence!,
            probabilities: classification.probabilities || {},
          },
          createdAt: new Date(),
          tags: extractTags(documentContent, classification.prediction!),
        };

        workspace.documents.push(document);
        
        // Update stats
        workspace.stats.totalDocuments++;
        workspace.stats.categoryDistribution[classification.prediction!] = 
          (workspace.stats.categoryDistribution[classification.prediction!] || 0) + 1;
        workspace.stats.averageConfidence = 
          workspace.documents.reduce((sum, doc) => sum + doc.classification.confidence, 0) / 
          workspace.documents.length;

        return NextResponse.json({
          success: true,
          document,
          workspace: {
            id: workspace.id,
            name: workspace.name,
            category: workspace.category,
          },
        });
      }

      case 'get-workspaces': {
        return NextResponse.json({
          success: true,
          workspaces: userWorkspaces.map(w => ({
            id: w.id,
            name: w.name,
            category: w.category,
            documentCount: w.documents.length,
            stats: w.stats,
          })),
        });
      }

      case 'get-workspace': {
        const workspace = userWorkspaces.find(w => w.id === workspaceId);
        if (!workspace) {
          return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, workspace });
      }

      case 'search': {
        const { query, category } = await request.json();
        const results = userWorkspaces
          .filter(w => !category || w.category === category)
          .flatMap(w => w.documents)
          .filter(doc => 
            doc.name.toLowerCase().includes(query.toLowerCase()) ||
            doc.content.toLowerCase().includes(query.toLowerCase()) ||
            doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
          );

        return NextResponse.json({ success: true, results });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Workspace API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function extractTags(content: string, category: string): string[] {
  const tags = [category];
  
  // Extract common business terms
  const keywords = [
    'analysis', 'report', 'summary', 'research', 'data', 'findings',
    'conclusion', 'recommendation', 'strategy', 'plan', 'project',
    'financial', 'technical', 'business', 'scientific', 'medical'
  ];

  const lowerContent = content.toLowerCase();
  keywords.forEach(keyword => {
    if (lowerContent.includes(keyword) && !tags.includes(keyword)) {
      tags.push(keyword);
    }
  });

  return tags.slice(0, 5); // Limit to 5 tags
}

