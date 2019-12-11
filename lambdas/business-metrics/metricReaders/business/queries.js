const impressions = `
select 'impressions' as entity, DATEDIFF(MINUTE, max(impression_timestamp), sysdate) as value, 'IMPRESSIONS_FRESHNESS' as metric
from  fact_events_stripped where unified_date_prt >= current_date - 1
`;

const clickouts = `
select 'clickouts' as entity, DATEDIFF(MINUTE, max(clickout_timestamp), sysdate) as value, 'CLICKOUTS_FRESHNESS' as metric
from  clickouts_view where clickout_date_prt >= current_date - 1;
`;

const earnings = `
select 'earnings_inputs' as entity, DATEDIFF(MINUTE, max(forminstances_saved_at), sysdate) as value, 'EARNINGS_INPUTS_FRESHNESS' as metric
from  dlk_visitor_funnel_dwh_production.earnings_inputs where forminstances_saved_at >= current_date - 1;
`;

const aggregations = `
select qry_type as entitiy, DATEDIFF(day, max(date), current_date) as value, 'DAILY_AGG' + upper(qry_type) + '_FRESHNESS' from v_daily_aggregates
where date > current_date - 3
group by qry_type ;
`;




module.exports = {
  impressions,
  clickouts,
  earnings,
  aggregations
};