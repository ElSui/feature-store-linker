
export interface RegulatoryDocument {
  id: number;
  name: string;
  source: string;
  region: string;
  publication_date: string;
  summary: string;
}

export interface UseCase {
  id: number;
  name: string;
  description: string;
}

export interface RiskIndicator {
  id: number;
  name: string;
  description: string;
  category: string;
}

export interface Feature {
  id: number;
  name: string;
  type: 'AI Model Feature' | 'Simple Rule' | 'Calculation';
  description: string;
  logic_summary: string;
}

export interface DocumentUseCaseLink {
  document_id: number;
  usecase_id: number;
}

export interface UseCaseRiskLink {
  usecase_id: number;
  risk_id: number;
}

export interface RiskFeatureLink {
  risk_id: number;
  feature_id: number;
}

class DataStore {
  private documents: RegulatoryDocument[] = [
    {
      id: 1,
      name: "Global AML Framework",
      source: "International Body",
      region: "Global",
      publication_date: "2023-01-15",
      summary: "Comprehensive anti-money laundering framework for global implementation"
    },
    {
      id: 2,
      name: "EU Payment Services Directive",
      source: "EU Commission",
      region: "EU",
      publication_date: "2023-03-20",
      summary: "Regulatory framework for payment services within the European Union"
    },
    {
      id: 3,
      name: "Guidance on Virtual Assets",
      source: "FATF",
      region: "Global",
      publication_date: "2023-06-30",
      summary: "Updated guidance for virtual asset service providers and digital asset compliance"
    }
  ];

  private useCases: UseCase[] = [
    {
      id: 1,
      name: "Cross-Border Payments",
      description: "Facilitating international money transfers with compliance oversight"
    },
    {
      id: 2,
      name: "E-Wallet Services",
      description: "Digital wallet services for retail and business customers"
    },
    {
      id: 3,
      name: "Trade Based Money Laundering (TBML) Prevention",
      description: "Detection and prevention of trade-based money laundering schemes"
    }
  ];

  private riskIndicators: RiskIndicator[] = [
    {
      id: 1,
      name: "Transactions to/from High-Risk Jurisdictions",
      description: "Transactions showing patterns to/from jurisdictions with higher AML risk",
      category: "Geographic"
    },
    {
      id: 2,
      name: "Rapid Movement of Funds",
      description: "Quick succession of transactions indicating potential layering activity",
      category: "Velocity"
    },
    {
      id: 3,
      name: "Structuring/Smurfing Behavior",
      description: "Multiple transactions just below reporting thresholds to avoid detection",
      category: "Transactional Pattern"
    },
    {
      id: 4,
      name: "Complex Corporate Ownership Structures",
      description: "Entities with complex or opaque ownership structures that may obscure beneficial ownership",
      category: "KYC/Entity Risk"
    },
    {
      id: 5,
      name: "Use of Anonymity-Enhanced Virtual Assets",
      description: "Transactions involving privacy coins or mixing services that enhance anonymity",
      category: "Digital Assets"
    }
  ];

  private features: Feature[] = [
    {
      id: 1,
      name: "High-Risk Jurisdiction Transaction Count",
      type: "AI Model Feature",
      description: "Monitors transaction frequency and volume to high-risk countries",
      logic_summary: "Uses machine learning to analyze transaction patterns to designated high-risk jurisdictions. Implemented in PySpark."
    },
    {
      id: 2,
      name: "Transaction Velocity Threshold Alert",
      type: "Simple Rule",
      description: "Alerts when transaction velocity exceeds defined parameters",
      logic_summary: "Simple threshold rule: alerts when transaction count exceeds 10 per hour for single customer"
    },
    {
      id: 3,
      name: "Structuring Detection Model",
      type: "AI Model Feature",
      description: "AI model to identify potential structuring patterns in customer transactions",
      logic_summary: "Deep learning model analyzing transaction amounts, frequencies, and timing patterns. Uses TensorFlow."
    },
    {
      id: 4,
      name: "Ultimate Beneficial Owner Verification Rule",
      type: "Simple Rule",
      description: "Ensures proper UBO identification for corporate entities",
      logic_summary: "Rule-based verification requiring UBO disclosure for entities above ownership thresholds"
    },
    {
      id: 5,
      name: "VA Mixer/Tumbler Interaction Feature",
      type: "AI Model Feature",
      description: "Detects interactions with virtual asset mixing or tumbling services",
      logic_summary: "Blockchain analysis model identifying transactions with known mixing services. Uses graph analysis algorithms."
    }
  ];

  private documentUseCaseLinks: DocumentUseCaseLink[] = [
    { document_id: 1, usecase_id: 1 },
    { document_id: 1, usecase_id: 2 },
    { document_id: 2, usecase_id: 1 },
    { document_id: 2, usecase_id: 2 },
    { document_id: 3, usecase_id: 2 }
  ];

  private useCaseRiskLinks: UseCaseRiskLink[] = [
    { usecase_id: 1, risk_id: 1 },
    { usecase_id: 1, risk_id: 2 },
    { usecase_id: 2, risk_id: 1 },
    { usecase_id: 2, risk_id: 3 },
    { usecase_id: 2, risk_id: 5 },
    { usecase_id: 3, risk_id: 4 },
    { usecase_id: 3, risk_id: 1 }
  ];

  private riskFeatureLinks: RiskFeatureLink[] = [
    { risk_id: 1, feature_id: 1 },
    { risk_id: 2, feature_id: 2 },
    { risk_id: 3, feature_id: 3 },
    { risk_id: 3, feature_id: 2 },
    { risk_id: 4, feature_id: 4 },
    { risk_id: 5, feature_id: 5 }
  ];

  // Document methods
  getDocuments(): RegulatoryDocument[] {
    return this.documents;
  }

  getDocument(id: number): RegulatoryDocument | undefined {
    return this.documents.find(doc => doc.id === id);
  }

  addDocument(document: Omit<RegulatoryDocument, 'id'>): RegulatoryDocument {
    const newId = Math.max(...this.documents.map(d => d.id), 0) + 1;
    const newDocument = { ...document, id: newId };
    this.documents.push(newDocument);
    return newDocument;
  }

  updateDocument(id: number, updates: Partial<RegulatoryDocument>): RegulatoryDocument | undefined {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index !== -1) {
      this.documents[index] = { ...this.documents[index], ...updates };
      return this.documents[index];
    }
    return undefined;
  }

  deleteDocument(id: number): boolean {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index !== -1) {
      this.documents.splice(index, 1);
      // Remove associated links
      this.documentUseCaseLinks = this.documentUseCaseLinks.filter(link => link.document_id !== id);
      return true;
    }
    return false;
  }

  // UseCase methods
  getUseCases(): UseCase[] {
    return this.useCases;
  }

  getUseCase(id: number): UseCase | undefined {
    return this.useCases.find(uc => uc.id === id);
  }

  addUseCase(useCase: Omit<UseCase, 'id'>): UseCase {
    const newId = Math.max(...this.useCases.map(uc => uc.id), 0) + 1;
    const newUseCase = { ...useCase, id: newId };
    this.useCases.push(newUseCase);
    return newUseCase;
  }

  updateUseCase(id: number, updates: Partial<UseCase>): UseCase | undefined {
    const index = this.useCases.findIndex(uc => uc.id === id);
    if (index !== -1) {
      this.useCases[index] = { ...this.useCases[index], ...updates };
      return this.useCases[index];
    }
    return undefined;
  }

  deleteUseCase(id: number): boolean {
    const index = this.useCases.findIndex(uc => uc.id === id);
    if (index !== -1) {
      this.useCases.splice(index, 1);
      // Remove associated links
      this.documentUseCaseLinks = this.documentUseCaseLinks.filter(link => link.usecase_id !== id);
      this.useCaseRiskLinks = this.useCaseRiskLinks.filter(link => link.usecase_id !== id);
      return true;
    }
    return false;
  }

  // RiskIndicator methods
  getRiskIndicators(): RiskIndicator[] {
    return this.riskIndicators;
  }

  getRiskIndicator(id: number): RiskIndicator | undefined {
    return this.riskIndicators.find(ri => ri.id === id);
  }

  addRiskIndicator(riskIndicator: Omit<RiskIndicator, 'id'>): RiskIndicator {
    const newId = Math.max(...this.riskIndicators.map(ri => ri.id), 0) + 1;
    const newRiskIndicator = { ...riskIndicator, id: newId };
    this.riskIndicators.push(newRiskIndicator);
    return newRiskIndicator;
  }

  updateRiskIndicator(id: number, updates: Partial<RiskIndicator>): RiskIndicator | undefined {
    const index = this.riskIndicators.findIndex(ri => ri.id === id);
    if (index !== -1) {
      this.riskIndicators[index] = { ...this.riskIndicators[index], ...updates };
      return this.riskIndicators[index];
    }
    return undefined;
  }

  deleteRiskIndicator(id: number): boolean {
    const index = this.riskIndicators.findIndex(ri => ri.id === id);
    if (index !== -1) {
      this.riskIndicators.splice(index, 1);
      // Remove associated links
      this.useCaseRiskLinks = this.useCaseRiskLinks.filter(link => link.risk_id !== id);
      this.riskFeatureLinks = this.riskFeatureLinks.filter(link => link.risk_id !== id);
      return true;
    }
    return false;
  }

  // Feature methods (renamed from Control)
  getFeatures(): Feature[] {
    return this.features;
  }

  getFeature(id: number): Feature | undefined {
    return this.features.find(f => f.id === id);
  }

  addFeature(feature: Omit<Feature, 'id'>): Feature {
    const newId = Math.max(...this.features.map(f => f.id), 0) + 1;
    const newFeature = { ...feature, id: newId };
    this.features.push(newFeature);
    return newFeature;
  }

  updateFeature(id: number, updates: Partial<Feature>): Feature | undefined {
    const index = this.features.findIndex(f => f.id === id);
    if (index !== -1) {
      this.features[index] = { ...this.features[index], ...updates };
      return this.features[index];
    }
    return undefined;
  }

  deleteFeature(id: number): boolean {
    const index = this.features.findIndex(f => f.id === id);
    if (index !== -1) {
      this.features.splice(index, 1);
      // Remove associated links
      this.riskFeatureLinks = this.riskFeatureLinks.filter(link => link.feature_id !== id);
      return true;
    }
    return false;
  }

  // Relationship methods
  getLinkedUseCasesForDocument(documentId: number): UseCase[] {
    const linkedUseCaseIds = this.documentUseCaseLinks
      .filter(link => link.document_id === documentId)
      .map(link => link.usecase_id);
    return this.useCases.filter(uc => linkedUseCaseIds.includes(uc.id));
  }

  getLinkedDocumentsForUseCase(useCaseId: number): RegulatoryDocument[] {
    const linkedDocumentIds = this.documentUseCaseLinks
      .filter(link => link.usecase_id === useCaseId)
      .map(link => link.document_id);
    return this.documents.filter(doc => linkedDocumentIds.includes(doc.id));
  }

  getLinkedRiskIndicatorsForUseCase(useCaseId: number): RiskIndicator[] {
    const linkedRiskIds = this.useCaseRiskLinks
      .filter(link => link.usecase_id === useCaseId)
      .map(link => link.risk_id);
    return this.riskIndicators.filter(ri => linkedRiskIds.includes(ri.id));
  }

  getLinkedUseCasesForRiskIndicator(riskId: number): UseCase[] {
    const linkedUseCaseIds = this.useCaseRiskLinks
      .filter(link => link.risk_id === riskId)
      .map(link => link.usecase_id);
    return this.useCases.filter(uc => linkedUseCaseIds.includes(uc.id));
  }

  getLinkedFeaturesForRiskIndicator(riskId: number): Feature[] {
    const linkedFeatureIds = this.riskFeatureLinks
      .filter(link => link.risk_id === riskId)
      .map(link => link.feature_id);
    return this.features.filter(f => linkedFeatureIds.includes(f.id));
  }

  getLinkedRiskIndicatorsForFeature(featureId: number): RiskIndicator[] {
    const linkedRiskIds = this.riskFeatureLinks
      .filter(link => link.feature_id === featureId)
      .map(link => link.risk_id);
    return this.riskIndicators.filter(ri => linkedRiskIds.includes(ri.id));
  }

  // Link management methods
  addDocumentUseCaseLink(documentId: number, useCaseId: number): void {
    if (!this.documentUseCaseLinks.find(link => 
      link.document_id === documentId && link.usecase_id === useCaseId)) {
      this.documentUseCaseLinks.push({ document_id: documentId, usecase_id: useCaseId });
    }
  }

  removeDocumentUseCaseLink(documentId: number, useCaseId: number): void {
    this.documentUseCaseLinks = this.documentUseCaseLinks.filter(link => 
      !(link.document_id === documentId && link.usecase_id === useCaseId));
  }

  addUseCaseRiskLink(useCaseId: number, riskId: number): void {
    if (!this.useCaseRiskLinks.find(link => 
      link.usecase_id === useCaseId && link.risk_id === riskId)) {
      this.useCaseRiskLinks.push({ usecase_id: useCaseId, risk_id: riskId });
    }
  }

  removeUseCaseRiskLink(useCaseId: number, riskId: number): void {
    this.useCaseRiskLinks = this.useCaseRiskLinks.filter(link => 
      !(link.usecase_id === useCaseId && link.risk_id === riskId));
  }

  addRiskFeatureLink(riskId: number, featureId: number): void {
    if (!this.riskFeatureLinks.find(link => 
      link.risk_id === riskId && link.feature_id === featureId)) {
      this.riskFeatureLinks.push({ risk_id: riskId, feature_id: featureId });
    }
  }

  removeRiskFeatureLink(riskId: number, featureId: number): void {
    this.riskFeatureLinks = this.riskFeatureLinks.filter(link => 
      !(link.risk_id === riskId && link.feature_id === featureId));
  }
}

export const dataStore = new DataStore();
