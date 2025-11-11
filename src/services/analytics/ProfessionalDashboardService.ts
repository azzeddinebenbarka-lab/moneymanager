import { accountService } from '../accountService';
import { annualChargeService } from '../annualChargeService';
import { budgetService } from '../budgetService';
import { debtService } from '../debtService';
import { savingsService } from '../savingsService';
import { transactionService } from '../transactionService';

import {
    BudgetChargesMetrics,
    CalculDonneesBrutes,
    CashFlowMetrics,
    FinancialHealthIndicators,
    PatrimoineMetrics,
    ProfessionalDashboardData,
    ProfessionalFilters
} from '../../types/ProfessionalDashboard';

export class ProfessionalDashboardService {
  private userId: string;

  constructor(userId: string = 'default-user') {
    this.userId = userId;
  }

  // ✅ MÉTHODE PRINCIPALE - CALCUL COMPLET
  async calculerDashboardProfessionnel(
    filters: ProfessionalFilters
  ): Promise<ProfessionalDashboardData> {
    try {
      console.log('🎯 [ProfessionalDashboardService] Calcul dashboard professionnel...', filters);

      // 1. RÉCUPÉRATION DES DONNÉES BRUTES
      const donneesBrutes = await this.recupererDonneesBrutes();
      
      // 2. CALCULS PARALÈLES DES MÉTRIQUES
      const [cashFlow, patrimoine, budgetCharges] = await Promise.all([
        this.calculerCashFlow(donneesBrutes, filters),
        this.calculerPatrimoine(donneesBrutes, filters),
        this.calculerBudgetCharges(donneesBrutes, filters)
      ]);

      // 3. ANALYSE DE SANTÉ FINANCIÈRE
      const indicateurs = this.analyserSanteFinanciere(cashFlow, patrimoine, budgetCharges);

      // 4. CONSTRUCTION DU RÉSULTAT FINAL
      const resultat: ProfessionalDashboardData = {
        cashFlow,
        patrimoine,
        budgetCharges,
        indicateurs,
        periode: {
          annee: filters.annee,
          mois: filters.mois,
          libelle: this.getPeriodeLibelle(filters.mois, filters.annee)
        }
      };

      console.log('✅ [ProfessionalDashboardService] Dashboard professionnel calculé avec succès');
      return resultat;

    } catch (error) {
      console.error('❌ [ProfessionalDashboardService] Erreur calcul dashboard:', error);
      throw new Error('Impossible de calculer le dashboard professionnel');
    }
  }

  // ✅ RÉCUPÉRATION DES DONNÉES BRUTES
  private async recupererDonneesBrutes(): Promise<CalculDonneesBrutes> {
    const [
      transactions,
      comptes,
      dettes,
      objectifsEpargne,
      chargesAnnuelles,
      budgets
    ] = await Promise.all([
      transactionService.getAllTransactions(this.userId),
      accountService.getAllAccounts(),
      debtService.getAllDebts(this.userId),
      savingsService.getAllSavingsGoals(this.userId),
      annualChargeService.getAllAnnualCharges(this.userId),
      budgetService.getAllBudgets(this.userId)
    ]);

    return {
      transactions,
      comptes,
      dettes,
      objectifsEpargne,
      chargesAnnuelles,
      budgets
    };
  }

  // ✅ CALCUL CASH FLOW PROFESSIONNEL
  private async calculerCashFlow(
    donnees: CalculDonneesBrutes,
    filters: ProfessionalFilters
  ): Promise<CashFlowMetrics> {
    const { transactions, dettes, budgets } = donnees;
    
    // Transactions du mois filtré
    const transactionsMois = this.filtrerTransactionsParMois(transactions, filters);
    
    // Calcul des différentes composantes
    const revenus = this.calculerRevenus(transactionsMois);
    const depensesCourantes = this.calculerDepensesCourantes(transactionsMois);
    const chargesFixes = this.calculerChargesFixes(dettes, budgets);
    const paiementsDettes = this.calculerPaiementsDettes(dettes);
    const epargneProgrammee = this.calculerEpargneProgrammee(donnees.objectifsEpargne);
    
    const cashFlowNet = revenus - depensesCourantes - chargesFixes - paiementsDettes - epargneProgrammee;

    return {
      revenus,
      depensesCourantes,
      chargesFixes,
      paiementsDettes,
      epargneProgrammee,
      cashFlowNet,
      dateCalcul: new Date().toISOString()
    };
  }

  // ✅ CALCUL PATRIMOINE NET PROFESSIONNEL
  private async calculerPatrimoine(
    donnees: CalculDonneesBrutes,
    filters: ProfessionalFilters
  ): Promise<PatrimoineMetrics> {
    const { comptes, objectifsEpargne, dettes, chargesAnnuelles } = donnees;
    
    // Distinction entre comptes courants et épargne long terme
    const soldeComptesCourants = comptes
      .filter(compte => compte.type === 'cash' || compte.type === 'bank' || compte.type === 'card')
      .reduce((sum, compte) => sum + compte.balance, 0);
    
    const epargneLongTerme = comptes
      .filter(compte => compte.type === 'savings')
      .reduce((sum, compte) => sum + compte.balance, 0);
    
    // Fonds dédié aux charges annuelles
    const fondsChargesAnnuelles = this.calculerFondsChargesAnnuelles(chargesAnnuelles);
    
    // Total des dettes actives
    const totalDettes = dettes
      .filter(dette => dette.status === 'active' || dette.status === 'overdue')
      .reduce((sum, dette) => sum + dette.currentAmount, 0);
    
    const patrimoineNetLiquide = soldeComptesCourants + epargneLongTerme + fondsChargesAnnuelles - totalDettes;

    return {
      soldeComptesCourants,
      epargneLongTerme,
      fondsChargesAnnuelles,
      totalDettes,
      patrimoineNetLiquide,
      actifsLiquides: soldeComptesCourants,
      actifsInvestis: epargneLongTerme,
      dateCalcul: new Date().toISOString()
    };
  }

  // ✅ CALCUL BUDGET CHARGES ANNUELLES
  private async calculerBudgetCharges(
    donnees: CalculDonneesBrutes,
    filters: ProfessionalFilters
  ): Promise<BudgetChargesMetrics> {
    const { chargesAnnuelles, comptes } = donnees;
    
    const chargesNonPayees = chargesAnnuelles.filter(charge => !charge.isPaid);
    const fondsDisponible = this.calculerFondsChargesAnnuelles(chargesAnnuelles);
    
    // Charges du mois courant
    const chargesMoisCourant = this.calculerChargesMoisCourant(chargesNonPayees, filters);
    
    // Calcul de l'épargne mensuelle requise
    const totalChargesAnnuelles = chargesNonPayees.reduce((sum, charge) => sum + charge.amount, 0);
    const epargneMensuelleRequise = totalChargesAnnuelles / 12;
    
    const soldeApresCharges = fondsDisponible - chargesMoisCourant;
    const moisCouverts = epargneMensuelleRequise > 0 ? fondsDisponible / epargneMensuelleRequise : 0;
    
    // Prochaine charge à venir
    const prochaineCharge = this.trouverProchaineCharge(chargesNonPayees);

    return {
      fondsDisponible,
      chargesMoisCourant,
      soldeApresCharges,
      epargneMensuelleRequise,
      moisCouverts,
      prochaineCharge
    };
  }

  // ✅ ANALYSE SANTÉ FINANCIÈRE
  private analyserSanteFinanciere(
    cashFlow: CashFlowMetrics,
    patrimoine: PatrimoineMetrics,
    budgetCharges: BudgetChargesMetrics
  ): FinancialHealthIndicators {
    // Taux d'épargne
    const tauxEpargne = cashFlow.revenus > 0 ? 
      (cashFlow.epargneProgrammee / cashFlow.revenus) * 100 : 0;
    
    // Ratio dettes/revenus
    const ratioDettesRevenus = cashFlow.revenus > 0 ? 
      (patrimoine.totalDettes / (cashFlow.revenus * 12)) * 100 : 0;
    
    // Couverture des charges (en mois)
    const couvertureChargesMois = budgetCharges.moisCouverts;
    
    // Liquidité immédiate (mois de dépenses couverts)
    const depensesMensuelles = cashFlow.depensesCourantes + cashFlow.chargesFixes + cashFlow.paiementsDettes;
    const liquiditeImmediate = depensesMensuelles > 0 ? 
      patrimoine.soldeComptesCourants / depensesMensuelles : 0;
    
    // Score global et santé
    const { scoreGlobal, santeFinanciere } = this.calculerScoreSante({
      tauxEpargne,
      ratioDettesRevenus,
      couvertureChargesMois,
      liquiditeImmediate,
      cashFlowNet: cashFlow.cashFlowNet
    });
    
    // Recommandations personnalisées
    const recommandations = this.genererRecommandations({
      tauxEpargne,
      ratioDettesRevenus,
      couvertureChargesMois,
      liquiditeImmediate,
      santeFinanciere
    });

    return {
      tauxEpargne,
      ratioDettesRevenus,
      couvertureChargesMois,
      liquiditeImmediate,
      santeFinanciere,
      scoreGlobal,
      recommandations
    };
  }

  // === MÉTHODES DE CALCUL INTERMÉDIAIRES ===

  private filtrerTransactionsParMois(transactions: any[], filters: ProfessionalFilters): any[] {
    return transactions.filter(transaction => {
      const dateTransaction = new Date(transaction.date);
      return dateTransaction.getFullYear() === filters.annee && 
             dateTransaction.getMonth() + 1 === filters.mois;
    });
  }

  private calculerRevenus(transactions: any[]): number {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }

  private calculerDepensesCourantes(transactions: any[]): number {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }

  private calculerChargesFixes(dettes: any[], budgets: any[]): number {
    const chargesDettes = dettes
      .filter(d => d.status === 'active' || d.status === 'overdue')
      .reduce((sum, d) => sum + (d.monthlyPayment || 0), 0);
    
    const chargesBudgets = budgets
      .filter(b => b.isActive)
      .reduce((sum, b) => sum + b.amount, 0);
    
    return chargesDettes + chargesBudgets;
  }

  private calculerPaiementsDettes(dettes: any[]): number {
    return dettes
      .filter(d => d.status === 'active' || d.status === 'overdue')
      .reduce((sum, d) => sum + (d.monthlyPayment || 0), 0);
  }

  private calculerEpargneProgrammee(objectifsEpargne: any[]): number {
    return objectifsEpargne
      .filter(goal => !goal.isCompleted)
      .reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0);
  }

  private calculerFondsChargesAnnuelles(chargesAnnuelles: any[]): number {
    // Pour l'instant, on considère qu'un compte spécifique existe pour les charges annuelles
    // À améliorer avec une gestion dédiée
    return chargesAnnuelles
      .filter(charge => !charge.isPaid)
      .reduce((sum, charge) => sum + (charge.amount / 12), 0) * 3; // 3 mois de couverture
  }

  private calculerChargesMoisCourant(chargesAnnuelles: any[], filters: ProfessionalFilters): number {
    const maintenant = new Date();
    return chargesAnnuelles
      .filter(charge => {
        const dateEcheance = new Date(charge.dueDate);
        return dateEcheance.getFullYear() === filters.annee && 
               dateEcheance.getMonth() + 1 === filters.mois;
      })
      .reduce((sum, charge) => sum + charge.amount, 0);
  }

  private trouverProchaineCharge(chargesAnnuelles: any[]): any {
    const maintenant = new Date();
    const chargesFutures = chargesAnnuelles
      .filter(charge => new Date(charge.dueDate) > maintenant)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    
    if (chargesFutures.length === 0) return undefined;
    
    const prochaine = chargesFutures[0];
    const joursRestants = Math.ceil((new Date(prochaine.dueDate).getTime() - maintenant.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      nom: prochaine.name,
      montant: prochaine.amount,
      date: prochaine.dueDate,
      joursRestants
    };
  }

  private calculerScoreSante(indicators: any): { scoreGlobal: number; santeFinanciere: FinancialHealthIndicators['santeFinanciere'] } {
    let score = 100;
    
    // Pénalités/Bonus selon les indicateurs
    if (indicators.tauxEpargne < 10) score -= 20;
    else if (indicators.tauxEpargne > 20) score += 10;
    
    if (indicators.ratioDettesRevenus > 40) score -= 25;
    else if (indicators.ratioDettesRevenus < 20) score += 10;
    
    if (indicators.couvertureChargesMois < 3) score -= 20;
    else if (indicators.couvertureChargesMois > 6) score += 10;
    
    if (indicators.liquiditeImmediate < 1) score -= 25;
    else if (indicators.liquiditeImmediate > 3) score += 10;
    
    if (indicators.cashFlowNet < 0) score -= 30;
    else if (indicators.cashFlowNet > 0) score += 15;
    
    score = Math.max(0, Math.min(100, score));
    
    let santeFinanciere: FinancialHealthIndicators['santeFinanciere'];
    if (score >= 80) santeFinanciere = 'EXCELLENT';
    else if (score >= 60) santeFinanciere = 'BON';
    else if (score >= 40) santeFinanciere = 'ATTENTION';
    else santeFinanciere = 'CRITIQUE';
    
    return { scoreGlobal: Math.round(score), santeFinanciere };
  }

  private genererRecommandations(indicators: any): string[] {
    const recommandations: string[] = [];
    
    if (indicators.tauxEpargne < 10) {
      recommandations.push('Augmentez votre taux d\'épargne à au moins 10% de vos revenus');
    }
    
    if (indicators.ratioDettesRevenus > 35) {
      recommandations.push('Priorisez le remboursement de vos dettes pour réduire votre ratio');
    }
    
    if (indicators.couvertureChargesMois < 3) {
      recommandations.push('Constituer un fonds de sécurité de 3 mois de charges annuelles');
    }
    
    if (indicators.liquiditeImmediate < 1) {
      recommandations.push('Maintenez au moins 1 mois de dépenses en liquidités disponibles');
    }
    
    if (indicators.santeFinanciere === 'CRITIQUE') {
      recommandations.push('Consultez un conseiller financier pour un plan de redressement');
    }
    
    if (recommandations.length === 0) {
      recommandations.push('Continuez sur cette excellente voie financière !');
    }
    
    return recommandations;
  }

  private getPeriodeLibelle(mois: number, annee: number): string {
    const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                     'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${moisNoms[mois - 1]} ${annee}`;
  }

  // ✅ MÉTHODE UTILITAIRE POUR TESTS
  async testerCalculs(): Promise<void> {
    try {
      const filters: ProfessionalFilters = {
        annee: new Date().getFullYear(),
        mois: new Date().getMonth() + 1,
        inclurePrevisions: true,
        modeCalcul: 'realiste'
      };
      
      const resultat = await this.calculerDashboardProfessionnel(filters);
      console.log('🧪 [ProfessionalDashboardService] Test réussi:', resultat);
    } catch (error) {
      console.error('🧪 [ProfessionalDashboardService] Test échoué:', error);
    }
  }
}

// Export singleton pour une utilisation facile
export const professionalDashboardService = new ProfessionalDashboardService();