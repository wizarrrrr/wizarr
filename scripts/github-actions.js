/**
 * This script allows you to delete actions for a workflow in a GitHub repository.
 *
 * Just run `node scripts/github-actions.js` and follow the prompts.
 *
 * You will need to create a `github_token.txt` file in the `scripts` directory
 * with a GitHub Personal Access Token with the `repo` scope.
 *
 * USE THIS SCRIPT AT YOUR OWN RISK! I AM NOT RESPONSIBLE FOR ANY DATA LOSS!
 *
 * MIT License (c) 2023 Ashley Bailey
 */
const run = async () => {
    const { Octokit } = require("octokit");
    const prompts = require("prompts");
    const fs = require("fs");
    const path = require("path");

    // Read GitHub Token from github_token.txt
    const getToken = () => {
        try {
            const filePath = path.join(__dirname, "github_token.txt");
            return fs.readFileSync(filePath, "utf8").trim();
        } catch (error) {
            console.error("Error reading GitHub token. Ensure github_token.txt exists.");
            process.exit(1);
        }
    };

    // Get authenticated Octokit client instance
    const getOctokit = () => new Octokit({ auth: getToken() });

    // Fetch repositories
    const getRepositories = async (octokit, type, org = null) => {
        try {
            return type === "personal" ? await octokit.rest.repos.listForAuthenticatedUser() : await octokit.rest.repos.listForOrg({ org });
        } catch (error) {
            console.error("Error fetching repositories:", error.message);
            process.exit(1);
        }
    };

    // Fetch organizations
    const getOrganizations = async (octokit) => {
        try {
            return await octokit.rest.orgs.listForAuthenticatedUser();
        } catch (error) {
            console.error("Error fetching organizations:", error.message);
            process.exit(1);
        }
    };

    const resetCLI = (username) => {
        console.clear();
        console.log(`Hello, ${username}!`);
        console.log("Welcome to the GitHub Actions CLI!\n");
    };

    const octokit = getOctokit();
    let username;

    try {
        const { data } = await octokit.rest.users.getAuthenticated();
        username = data.login;
    } catch (error) {
        console.error("Error authenticating with GitHub:", error.message);
        process.exit(1);
    }

    resetCLI(username);

    // Account type selection
    const { account } = await prompts({
        type: "select",
        name: "account",
        message: "Select an account type:",
        choices: [
            { title: "Personal", value: "personal" },
            { title: "Organization", value: "organization" },
        ],
        initial: 0,
    });

    resetCLI(username);

    let organization = null;
    let organizations = [];

    if (account === "organization") {
        const { data } = await getOrganizations(octokit);
        organizations = data;

        if (organizations.length === 0) {
            console.error("No organizations found. Exiting...");
            process.exit(1);
        }

        const orgSelection = await prompts({
            type: "select",
            name: "organization",
            message: "Select an organization:",
            choices: organizations.map(({ login }) => ({ title: login, value: login })),
            initial: 0,
        });

        organization = orgSelection.organization;
    }

    resetCLI(username);

    // Repository selection
    const { data: repositories } = await getRepositories(octokit, account, organization);

    if (repositories.length === 0) {
        console.error("No repositories found. Exiting...");
        process.exit(1);
    }

    const { repository } = await prompts({
        type: "select",
        name: "repository",
        message: "Select a repository:",
        choices: repositories.map(({ name }) => ({ title: name, value: name })),
        initial: 0,
    });

    resetCLI(username);

    // Action selection
    const { action } = await prompts({
        type: "select",
        name: "action",
        message: "Select an action:",
        choices: [{ title: "Delete actions for a workflow", value: "delete" }],
        initial: 0,
    });

    resetCLI(username);

    // Fetch workflows
    let workflows;
    try {
        const { data } = await octokit.rest.actions.listRepoWorkflows({
            owner: organization || username,
            repo: repository,
        });
        workflows = data.workflows;
    } catch (error) {
        console.error("Error fetching workflows:", error.message);
        process.exit(1);
    }

    if (workflows.length === 0) {
        console.error("No workflows found. Exiting...");
        process.exit(1);
    }

    // Workflow selection
    const { workflow } = await prompts({
        type: "select",
        name: "workflow",
        message: "Select a workflow:",
        choices: workflows.map(({ name }) => ({ title: name, value: name })),
        initial: 0,
    });

    resetCLI(username);

    // Fetch workflow runs
    let workflowRuns;
    let totalCount;

    try {
        const { data } = await octokit.rest.actions.listWorkflowRuns({
            owner: organization || username,
            repo: repository,
            workflow_id: workflows.find(({ name }) => name === workflow).id,
        });

        totalCount = data.total_count;
        workflowRuns = data.workflow_runs;
    } catch (error) {
        console.error("Error fetching workflow runs:", error.message);
        process.exit(1);
    }

    if (totalCount === 0) {
        console.log(`No actions found for the ${workflow} workflow.`);
        process.exit(0);
    }

    // Confirm deletion
    const { confirm } = await prompts({
        type: "confirm",
        name: "confirm",
        message: `Are you sure you want to delete all ${totalCount} actions for the "${workflow}" workflow?`,
        initial: false,
    });

    if (!confirm) {
        console.log("Operation cancelled.");
        process.exit(0);
    }

    resetCLI(username);

    // Delete workflow runs
    try {
        for (const run of workflowRuns) {
            console.log(`Deleting action ${run.id}...`);
            await octokit.rest.actions.deleteWorkflowRun({
                owner: organization || username,
                repo: repository,
                run_id: run.id,
            });
        }
        console.log(`Successfully deleted ${totalCount} actions for the "${workflow}" workflow.`);
    } catch (error) {
        console.error("Error deleting workflow runs:", error.message);
        process.exit(1);
    }
};

run();
