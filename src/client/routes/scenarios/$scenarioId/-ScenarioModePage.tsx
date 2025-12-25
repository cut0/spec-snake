import { Trans } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { Header } from '../../../components/Header';
import {
  ChevronRightIcon,
  DocumentIcon,
  PlusIcon,
} from '../../../components/Icons';
import { docsQueryOptions } from '../../../features/docs/queries/fetchDocsQueryOption';
import { scenarioQueryOptions } from '../../../features/scenario/queries/fetchScenarioQueryOption';

import { Route } from './';

export const ScenarioModePage = () => {
  const { scenarioId } = Route.useParams();
  const { data } = useSuspenseQuery(scenarioQueryOptions(scenarioId));
  const { scenario } = data;
  const { data: docs } = useSuspenseQuery(docsQueryOptions(scenarioId));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header />

        <div className="space-y-6">
          <div>
            <Link
              to="/scenarios"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 rounded"
            >
              &larr; <Trans>Back to Scenario List</Trans>
            </Link>
            <h2 className="mt-1 text-lg font-bold text-gray-900">
              {scenario.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/scenarios/$scenarioId/docs/new"
              params={{ scenarioId: scenario.id }}
              className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <PlusIcon className="size-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    <Trans>Create New</Trans>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <Trans>Create a new document from scratch</Trans>
                  </p>
                </div>
              </div>
              <ChevronRightIcon className="size-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </Link>

            <Link
              to="/scenarios/$scenarioId/docs"
              params={{ scenarioId: scenario.id }}
              className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-purple-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <DocumentIcon className="size-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    <Trans>Edit Existing</Trans>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <Trans>{docs.length} documents available</Trans>
                  </p>
                </div>
              </div>
              <ChevronRightIcon className="size-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
