import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { classifyDocument, classifyDocuments } from '@/lib/classifier';

interface SmartRecommendation {
  type: 'similar' | 'action' | 'insight' | 'connection';
  title: string;
  description: string;
  confidence: number;
  data?: any;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documents, currentCategory } = await request.json();

    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json({ error: 'Invalid documents' }, { status: 400 });
    }

    // Classify all documents
    const classifications = await classifyDocuments(documents);
    
    const recommendations: SmartRecommendation[] = [];

    // 1. Category Pattern Analysis
    const categoryCount: Record<string, number> = {};
    classifications.forEach(c => {
      if (c.success && c.prediction) {
        categoryCount[c.prediction] = (categoryCount[c.prediction] || 0) + 1;
      }
    });

    if (currentCategory && categoryCount[currentCategory] > 1) {
      recommendations.push({
        type: 'insight',
        title: 'Category Pattern Detected',
        description: `You have ${categoryCount[currentCategory]} ${currentCategory} documents. Consider creating a dedicated workspace.`,
        confidence: 0.9,
        data: { category: currentCategory, count: categoryCount[currentCategory] },
      });
    }

    // 2. Cross-Category Connections
    const categories = Object.keys(categoryCount);
    if (categories.includes('Financial Analysis') && categories.includes('Business Documents')) {
      recommendations.push({
        type: 'connection',
        title: 'Business-Finance Connection',
        description: 'Your financial reports might benefit from business strategy insights. Consider cross-referencing.',
        confidence: 0.85,
      });
    }

    if (categories.includes('Technical Reports') && categories.includes('Scientific Papers')) {
      recommendations.push({
        type: 'connection',
        title: 'Technical-Scientific Synergy',
        description: 'Combine technical implementation with scientific research for comprehensive analysis.',
        confidence: 0.88,
      });
    }

    // 3. Action Recommendations based on confidence
    const lowConfidenceDocs = classifications.filter(c => c.confidence && c.confidence < 0.7);
    if (lowConfidenceDocs.length > 0) {
      recommendations.push({
        type: 'action',
        title: 'Review Ambiguous Documents',
        description: `${lowConfidenceDocs.length} documents have low classification confidence. Consider manual review or restructuring.`,
        confidence: 0.75,
        data: { count: lowConfidenceDocs.length },
      });
    }

    // 4. Volume-based insights
    const totalDocs = documents.length;
    if (totalDocs >= 10) {
      const avgConfidence = classifications.reduce((sum, c) => sum + (c.confidence || 0), 0) / totalDocs;
      
      recommendations.push({
        type: 'insight',
        title: 'Document Collection Analysis',
        description: `Your ${totalDocs} documents have ${(avgConfidence * 100).toFixed(1)}% average classification confidence. ${
          avgConfidence > 0.85 ? 'Excellent document quality!' : 'Some documents may need clearer structure.'
        }`,
        confidence: 0.92,
        data: { totalDocs, avgConfidence },
      });
    }

    // 5. Specialized recommendations per category
    const specializedRecs = getSpecializedRecommendations(categoryCount);
    recommendations.push(...specializedRecs);

    // Sort by confidence
    recommendations.sort((a, b) => b.confidence - a.confidence);

    return NextResponse.json({
      success: true,
      recommendations: recommendations.slice(0, 5), // Top 5
      statistics: {
        totalDocuments: totalDocs,
        categoryDistribution: categoryCount,
        avgConfidence: classifications.reduce((sum, c) => sum + (c.confidence || 0), 0) / totalDocs,
      },
    });
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getSpecializedRecommendations(categoryCount: Record<string, number>): SmartRecommendation[] {
  const recs: SmartRecommendation[] = [];

  if (categoryCount['Financial Analysis'] >= 3) {
    recs.push({
      type: 'action',
      title: 'Financial Dashboard',
      description: 'Create a financial dashboard to visualize trends across your financial documents.',
      confidence: 0.87,
    });
  }

  if (categoryCount['Technical Reports'] >= 3) {
    recs.push({
      type: 'action',
      title: 'Technical Knowledge Base',
      description: 'Build a searchable technical knowledge base from your reports.',
      confidence: 0.86,
    });
  }

  if (categoryCount['Business Documents'] >= 5) {
    recs.push({
      type: 'insight',
      title: 'Business Intelligence',
      description: 'Extract key business metrics and trends from your document collection.',
      confidence: 0.89,
    });
  }

  if (categoryCount['Scientific Papers'] >= 2) {
    recs.push({
      type: 'action',
      title: 'Research Summary',
      description: 'Generate a comprehensive research summary combining all scientific findings.',
      confidence: 0.84,
    });
  }

  return recs;
}
