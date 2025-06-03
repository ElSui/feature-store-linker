
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

export interface Control {
  id: number;
  name: string;
  type: 'Feature' | 'Rule';
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

export interface RiskControlLink {
  risk_id: number;
  control_id: number;
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
      name: "FATF Guidance on Digital Assets",
      source: "FATF",
      region: "Global",
      publication_date: "2023-06-30",
      summary: "Updated guidance for virtual asset service providers and digital asset compliance"
    },
    {
      id: 3,
      name: "EU 5th AML Directive",
      source: "European Union",
      region: "EU",
      publication_date: "2022-12-10",
      summary: "Enhanced anti-money laundering measures for European financial institutions"
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
      name: "Trade Based Money Laundering",
      description: "Detection and prevention of trade-based money laundering schemes"
    }
  ];

  private riskIndicators: RiskIndicator[] = [
    {
      id: 1,
      name: "Unusual Transaction Patterns to High-Risk Countries",
      description: "Transactions showing abnormal patterns directed to high-risk jurisdictions",
      category: "Geographic Risk"
    },
    {
      id: 2,
      name: "Rapid Movement of Funds",
      description: "Quick succession of transactions indicating potential layering activity",
      category: "Transactional Velocity"
    },
    {
      id: 3,
      name: "Structuring Behavior",
      description: "Multiple transactions just below reporting thresholds",
      category: "Transaction Structuring"
    }
  ];

  private controls: Control[] = [
    {
      id: 1,
      name: "High-Risk Jurisdiction Velocity Alert",
      type: "Feature",
      description: "Monitors transaction frequency and volume to high-risk countries",
      logic_summary: "Counts transactions to specified countries in a time window and alerts on threshold breach"
    },
    {
      id: 2,
      name: "Transaction Velocity Rule",
      type: "Rule",
      description: "Blocks transactions when velocity exceeds defined parameters",
      logic_summary: "Automatically blocks when transaction count exceeds 10 per hour for single customer"
    },
    {
      id: 3,
      name: "Structuring Detection Feature",
      type: "Feature",
      description: "Identifies potential structuring patterns in customer transactions",
      logic_summary: "Analyzes transaction amounts and frequencies to detect structuring behavior"
    }
  ];

  private documentUseCaseLinks: DocumentUseCaseLink[] = [
    { document_id: 1, usecase_id: 1 },
    { document_id: 1, usecase_id: 2 },
    { document_id: 2, usecase_id: 2 },
    { document_id: 3, usecase_id: 3 }
  ];

  private useCaseRiskLinks: UseCaseRiskLink[] = [
    { usecase_id: 1, risk_id: 1 },
    { usecase_id: 1, risk_id: 2 },
    { usecase_id: 2, risk_id: 2 },
    { usecase_id: 3, risk_id: 3 }
  ];

  private riskControlLinks: RiskControlLink[] = [
    { risk_id: 1, control_id: 1 },
    { risk_id: 2, control_id: 2 },
    { risk_id: 3, control_id: 3 }
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
      this.riskControlLinks = this.riskControlLinks.filter(link => link.risk_id !== id);
      return true;
    }
    return false;
  }

  // Control methods
  getControls(): Control[] {
    return this.controls;
  }

  getControl(id: number): Control | undefined {
    return this.controls.find(c => c.id === id);
  }

  addControl(control: Omit<Control, 'id'>): Control {
    const newId = Math.max(...this.controls.map(c => c.id), 0) + 1;
    const newControl = { ...control, id: newId };
    this.controls.push(newControl);
    return newControl;
  }

  updateControl(id: number, updates: Partial<Control>): Control | undefined {
    const index = this.controls.findIndex(c => c.id === id);
    if (index !== -1) {
      this.controls[index] = { ...this.controls[index], ...updates };
      return this.controls[index];
    }
    return undefined;
  }

  deleteControl(id: number): boolean {
    const index = this.controls.findIndex(c => c.id === id);
    if (index !== -1) {
      this.controls.splice(index, 1);
      // Remove associated links
      this.riskControlLinks = this.riskControlLinks.filter(link => link.control_id !== id);
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

  getLinkedControlsForRiskIndicator(riskId: number): Control[] {
    const linkedControlIds = this.riskControlLinks
      .filter(link => link.risk_id === riskId)
      .map(link => link.control_id);
    return this.controls.filter(c => linkedControlIds.includes(c.id));
  }

  getLinkedRiskIndicatorsForControl(controlId: number): RiskIndicator[] {
    const linkedRiskIds = this.riskControlLinks
      .filter(link => link.control_id === controlId)
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

  addRiskControlLink(riskId: number, controlId: number): void {
    if (!this.riskControlLinks.find(link => 
      link.risk_id === riskId && link.control_id === controlId)) {
      this.riskControlLinks.push({ risk_id: riskId, control_id: controlId });
    }
  }

  removeRiskControlLink(riskId: number, controlId: number): void {
    this.riskControlLinks = this.riskControlLinks.filter(link => 
      !(link.risk_id === riskId && link.control_id === controlId));
  }
}

export const dataStore = new DataStore();
