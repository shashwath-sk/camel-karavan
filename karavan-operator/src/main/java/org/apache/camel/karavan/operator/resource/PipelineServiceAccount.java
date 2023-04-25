/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.camel.karavan.operator.resource;

import io.fabric8.kubernetes.api.model.ServiceAccount;
import io.fabric8.kubernetes.api.model.ServiceAccountBuilder;
import io.javaoperatorsdk.operator.api.reconciler.Context;
import io.javaoperatorsdk.operator.api.reconciler.dependent.ReconcileResult;
import io.javaoperatorsdk.operator.processing.dependent.kubernetes.CRUDKubernetesDependentResource;
import org.apache.camel.karavan.operator.Constants;
import org.apache.camel.karavan.operator.Utils;
import org.apache.camel.karavan.operator.spec.Karavan;

import java.util.Map;

public class PipelineServiceAccount extends CRUDKubernetesDependentResource<ServiceAccount, Karavan> {

    public PipelineServiceAccount() {
        super(ServiceAccount.class);
    }

    @Override
    @SuppressWarnings("unchecked")
    public ServiceAccount desired(Karavan karavan, Context<Karavan> context) {
        return new ServiceAccountBuilder()
                .withNewMetadata()
                .withName(Constants.SERVICEACCOUNT_PIPELINE)
                .withNamespace(karavan.getMetadata().getNamespace())
                .withLabels(Utils.getLabels(Constants.SERVICEACCOUNT_PIPELINE, Map.of()))
                .endMetadata()
                .build();
    }

    @Override
    public ReconcileResult<ServiceAccount> reconcile(Karavan karavan, Context<Karavan> context) {
        ServiceAccount sa = getKubernetesClient().serviceAccounts().inNamespace(karavan.getMetadata().getNamespace()).withName(Constants.SERVICEACCOUNT_PIPELINE).get();
        if (sa == null) {
            var desired = desired(karavan, context);
            var createdResource = handleCreate(desired, karavan, context);
            return ReconcileResult.resourceCreated(createdResource);
        } else {
            return ReconcileResult.noOperation(sa);
        }
    }
}
