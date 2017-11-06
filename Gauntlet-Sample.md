---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Intent and product brand in a unique string of 43-59 chars including spaces | Microsoft Docs 
description: 115-145 characters including spaces. Edit the intro para describing article intent to fit here. This abstract displays in the search result.
services: service-name-with-dashes-AZURE-ONLY 
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: github-alias
ms.author: MSFT-alias-person-or-DL
ms.date: 10/09/2017
ms.topic: article-type-from-white-list
# Use only one of the following. Use ms.service for services, ms.prod for on-prem. Remove the # before the relevant field.
# ms.service: service-name-from-white-list
# product-name-from-white-list

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
# manager: MSFT-alias-manager-or-PM-counterpart
---

<---! Fundamental, Day 1 instructions for new customers to use an Azure subscription to quickly use a specific product/service 
(zero to Wow in < 10 minutes). Include short, simple info and steps that require a new customer to have an Azure subscription and interact with your Azure service. 
Minimize the use of screenshots in Quickstart articles (rules for screenshots below)

- Metadata for this article should have ms.topic: hero-article; ms.custom: mvc
--->
<---! # Page heading (H1) - Unique, starts with "Create"
-->

*EXAMPLE*: 
# Create a Linux virtual machine with the Azure CLI

<---! Intro paragraph: 
1. 1-2 sentences that explain what customers will do and why it is useful.  Also, mention any relevant versioning information that the article is based on.
2. Use an include to make sure Azure CLI, PowerShell or Portal are installed and configured correctly-->
-->
*EXAMPLE*:
The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to deploy a virtual machine running Ubuntu 16.04 LTS.

<---! For every CLI article
1. Access to an Azure subscription
2. Mention the software version and (if required)
3. Include Cloud-Shell syntax
-->
*EXAMPLE*:
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This quick start requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

*REQUIRED*:
<---! CLI articles should contain Cloud-Shell access.  This requires both an Include at the top of the article as well as adding "-interactive" to each code block within the article.
-->
[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]
If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

*REQUIRED*:
## Create a resource group

Create a resource group with [az group create](/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

<---! Location hard coding guidance: eastus; westeurope
-->

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

<---! The next set of H2s describes the steps. Each H2 outlines the steps to completion ("Create a virtual machine", "Create a SQL Database"). 
- Avoid word wrap in right nav; keep H2 short and succinct
- Required H2: Prerequisites, Clean up resources, Next steps
- Make sure any screenshots align to the MVC standard
------------------->

*Example*:
## Create a logical server

Create an [Azure SQL Database logical server](sql-database-features.md) using the [az sql server create](/cli/azure/sql/server#create) command. A logical server contains a group of databases managed as a group. The following example creates a randomly named server in your resource group with an admin login named `ServerAdmin` and a password of `ChangeYourAdminPassword1`. Replace these pre-defined values as desired.

```azurecli-interactive
az sql server create --name $servername --resource-group $resourcegroupname --location $location \
	--admin-user $adminlogin --admin-password $password
```

<---! Other guidelines: 
Tip, note, important, warning: Use these extensions SPARINGLY to highlight info that broadens a user's knowledge. *Tip* is an easier way to do something, 
*Note* is "by the way" info, *Important* is info critical to completing a task, *Warning* is serious potential problem such as data loss.
--->

<---! This section should explicitly remind users to delete or clean up what was created in the above steps so that they do incur losses such as unexpected billing charges. --->

*EXAMPLE*:
## Clean up resources
Other quick starts in this collection build upon this quick start. If you plan to continue on to work with subsequent quick starts or with the tutorials, do not clean up the resources created in this quick start. If you do not plan to continue, use the following command to delete all resources created by this quick start.

```azurecli-interactive
az group delete --name $resourcegroupname
```

<---! A simple of list of articles that link to logical next steps.  This is probably a tutorial that is a superset of this QuickStart. Include no more than 3 next steps and make sure to include the additional formatting for highlighting in the UI 
-->

*EXAMPLE*:
## Next steps

In this quick start, you’ve deployed a simple virtual machine, a network security group rule, and installed a web server. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.

> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)
 
<---!
Rules for screenshots:
- Use default Public Portal colors​
- Remove personally identifiable information​
- Browser included in the first shot of the article​
- Resize the browser to minimize white space​
- Include complete blades in the screenshots​
- Linux: Safari – consider context in images​

Guidelines for outlining areas within screenshots:
- Red outline #ef4836
- 3px thick outline
- Text should be vertically centered within the outline.
- Length of outline should be dependent on where it sits within the screenshot. Make the shape fit the layout of the screenshot.
-->