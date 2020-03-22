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
select qry_type as entity, DATEDIFF(day, max(date), current_date) as value, 'DAILY_AGG' + upper(qry_type) + '_FRESHNESS' from v_daily_aggregates
where date > current_date - 3
group by qry_type ;
`;

const funnel_facts_revenue = `with
ernie as (select max(instancerows_accept_state_date) max_ei from dlk_visitor_funnel_dwh_production.earnings_inputs
 where instancerows_accept_state_date >= sysdate - 2),
ff as (select max(ei_accept_state_date) max_ff_ei from funnel_facts where ei_accept_state_date >= current_date - 2)
select 'funnel_facts_revenue' as entity, DATEDIFF(MINUTE,max_ff_ei, max_ei) as value, ‘FUNNEL_FACTS_REVENUE_FRESHNESS’ as metric
from ernie join ff on true=true`;

const funnel_facts_conversion = `select 'funnel_facts_conversion' as entity,
  DATEDIFF(MINUTE, max(conversion_timestamp),sysdate) as value, 'FUNNEL_FACTS_CONVERSION_FRESHNESS' as metric from 
  funnel_facts where conversion_timestamp >= current_date - 2 ;
`;


module.exports = {
    impressions: impressions,
    clickouts:  clickouts,
    earnings: earnings,
    aggregations: aggregations,
    funnel_facts_revenue: funnel_facts_revenue,
    funnel_facts_fact_conversion: funnel_facts_conversion
};