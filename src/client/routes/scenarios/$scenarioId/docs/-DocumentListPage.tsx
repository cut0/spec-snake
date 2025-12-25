import { Trans } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { Header } from '../../../../components/Header';
import {
  ChevronRightIcon,
  DocumentIcon,
  PlusIcon,
} from '../../../../components/Icons';
import {
  type DocumentWithMetadata,
  docsQueryOptions,
} from '../../../../features/docs/queries/fetchDocsQueryOption';
import { scenarioQueryOptions } from '../../../../features/scenario/queries/fetchScenarioQueryOption';

import { Route } from './';

export const DocumentListPage = () => {
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
              to="/scenarios/$scenarioId"
              params={{ scenarioId: scenario.id }}
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 rounded"
            >
              &larr; <Trans>Back</Trans>
            </Link>
            <h2 className="mt-1 text-lg font-bold text-gray-900">
              <Trans>Select Document to Edit</Trans>
            </h2>
            <p className="text-sm text-gray-500">{scenario.name}</p>
          </div>

          <div className="space-y-6">
            <Link
              to="/scenarios/$scenarioId/docs/new"
              params={{ scenarioId: scenario.id }}
              className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors group border-2 border-dashed border-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            >
              <div className="p-2 bg-indigo-200 rounded-lg group-hover:bg-indigo-300 transition-colors">
                <PlusIcon className="size-5 text-indigo-600" />
              </div>
              <span className="font-medium text-indigo-700">
                <Trans>Create New Document</Trans>
              </span>
            </Link>

            {docs.length === 0 ? (
              <div className="p-8 bg-white rounded-xl border border-gray-100 text-center">
                <DocumentIcon className="size-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  <Trans>No documents found</Trans>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {docs.map((doc: DocumentWithMetadata) => (
                  <Link
                    key={doc.filename}
                    to="/scenarios/$scenarioId/docs/$filename"
                    params={{ scenarioId: scenario.id, filename: doc.filename }}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-gray-50 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors shrink-0">
                        <DocumentIcon className="size-5 text-gray-600" />
                      </div>
                      <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                        {doc.filename}
                      </h3>
                    </div>
                    <ChevronRightIcon className="size-5 text-gray-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
