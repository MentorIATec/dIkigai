import { curatedGoalBankExtended } from '../src/lib/curated-goals';
import type { SemesterStage } from '../src/lib/types';

// Función para generar inventario completo
function generateGoalsInventory() {
  console.log('📊 INVENTARIO COMPLETO DE METAS POR DIMENSIÓN Y ETAPA\n');
  
  const dimensions = ['Ocupacional', 'Intelectual', 'Social', 'Física', 'Emocional', 'Financiera', 'Espiritual'];
  const stages: SemesterStage[] = ['primerSemestre', 'exploracion', 'enfoque', 'especializacion', 'graduacion', 'longitudinal'];
  
  let totalGoals = 0;
  
  stages.forEach(stage => {
    const stageData = curatedGoalBankExtended[stage];
    if (!stageData) return;
    
    console.log(`\n🎯 ETAPA: ${stageData.titulo.toUpperCase()}`);
    console.log(`📝 Descripción: ${stageData.descripcion}`);
    console.log(`📊 Total de metas: ${stageData.metas.length}`);
    
    const dimensionCount: Record<string, number> = {};
    const categoryCount: Record<string, number> = {};
    
    // Contar por dimensión y categoría
    stageData.metas.forEach(meta => {
      dimensionCount[meta.dimension] = (dimensionCount[meta.dimension] || 0) + 1;
      categoryCount[meta.categoria] = (categoryCount[meta.categoria] || 0) + 1;
    });
    
    console.log('\n📈 POR DIMENSIÓN:');
    dimensions.forEach(dim => {
      const count = dimensionCount[dim] || 0;
      const percentage = stageData.metas.length > 0 ? ((count / stageData.metas.length) * 100).toFixed(1) : '0.0';
      console.log(`  ${dim}: ${count} metas (${percentage}%)`);
    });
    
    console.log('\n🏷️ POR CATEGORÍA:');
    Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count} metas`);
      });
    
    // Mostrar metas específicas por dimensión
    console.log('\n📋 DETALLE POR DIMENSIÓN:');
    dimensions.forEach(dim => {
      const metasInDimension = stageData.metas.filter(meta => meta.dimension === dim);
      if (metasInDimension.length > 0) {
        console.log(`\n  🔹 ${dim} (${metasInDimension.length} metas):`);
        metasInDimension.forEach(meta => {
          console.log(`    • ${meta.id}: ${meta.metaSmarter.substring(0, 80)}...`);
        });
      }
    });
    
    totalGoals += stageData.metas.length;
    console.log('\n' + '='.repeat(80));
  });
  
  console.log(`\n🎯 RESUMEN GENERAL:`);
  console.log(`📊 Total de metas en el sistema: ${totalGoals}`);
  
  // Análisis de cobertura
  console.log(`\n📈 ANÁLISIS DE COBERTURA:`);
  stages.forEach(stage => {
    const stageData = curatedGoalBankExtended[stage];
    if (!stageData) return;
    
    const coverage = dimensions.map(dim => {
      const count = stageData.metas.filter(meta => meta.dimension === dim).length;
      return count > 0 ? '✅' : '❌';
    }).join(' ');
    
    console.log(`  ${stage}: ${coverage} (${stageData.metas.length} metas)`);
  });
  
  // Identificar dimensiones con poca cobertura
  console.log(`\n⚠️ DIMENSIONES CON POCA COBERTURA:`);
  dimensions.forEach(dim => {
    const totalInDimension = stages.reduce((acc, stage) => {
      const stageData = curatedGoalBankExtended[stage];
      if (!stageData) return acc;
      return acc + stageData.metas.filter(meta => meta.dimension === dim).length;
    }, 0);
    
    if (totalInDimension < 10) {
      console.log(`  ${dim}: Solo ${totalInDimension} metas en todo el sistema`);
    }
  });
}

// Ejecutar inventario
generateGoalsInventory();
