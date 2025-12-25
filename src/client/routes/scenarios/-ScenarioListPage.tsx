import { Trans } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { Header } from '../../components/Header';
import { ChevronRightIcon } from '../../components/Icons';
import { scenariosQueryOptions } from '../../features/scenario/queries/fetchScenariosQueryOption';

export const ScenarioListPage = () => {
  const { data: scenarios } = useSuspenseQuery(scenariosQueryOptions());

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header />

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">
            <Trans>Scenario List</Trans>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scenarios.map((scenario) => (
              <Link
                key={scenario.id}
                to="/scenarios/$scenarioId"
                params={{ scenarioId: scenario.id }}
                className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
              >
                <div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {scenario.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <Trans>{scenario.steps.length} steps</Trans>
                  </p>
                </div>
                <ChevronRightIcon className="size-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
