# GMT "Just a Website" Test

This repo is set up as an experiment in using the Green Metrics Tool, and their hosted measurement cluster to run measurements for interactions on a single website.

This was created as a follow up to feedback in the Djangocon Europe workshop linked below, and represents an example of a simplified `usage_scenario.yml`, to help people get to a measurement from a hosted GMT cluster as fast as possible.

#### Making it easy to go from 0 to one measurement

The goal here is to allow someone someone to drive a browser locally on their machine using a browser automation library, to help them define the steps they would to repeat against a system in a more controlled testing set up in future.

Tools like GMT are designed to spin up a system comprised of multiple components, and then measure the resources used carrying out representative tasks.

However when introducing people to the tool, it's flexiblity can be a barrier. Teaching people about docker and docker compose _as well as the Green Metrics Tool_, and all the new syntax in a `usage_file.yml` is a big ask.

Correspondingly, if one of the use cases is simulating interactions between a browser and website, there's an argument to just let people start driving a browser against an existing website, then introduce the use of a server set-up under test conditions later.


## Usage

Install the dependencies for nodejs:

```
npm install
```

Then, drive a local browser with nodejs, to carry out various actions on the Wagtail CMS website, using the script below.

```shell
LIVE_DEMO=1 USAGE_SCENARIO_DOMAIN=https://wagtail.org/ node ./homepage-landing.js
```

Let's break this down:


- `LIVE_DEMO` is a switch to run browser in a 'headed' configuration, so as an end user you can see the interactions you are scripting. Without it the browser is run in 'headless' mode, making it much harder to tell  what's going on.
- `USAGE_SCENARIO_DOMAIN` is used to define which website to run the browser actions against. We use the Wagtail.org website for convenience.


### Sending the job to a measurement cluster

Once you have a script running cleanly, and carrying out the interactions you want, you'd need a way to run it on a measurement cluster, and describe the scenario you want to run.

With GMT, you do this with the `flow` section of a `usage_scenarion.yml` file. It should look something like this:

```yaml

flow:
  - name: Homepage Landing
    container: green-coding-puppeteer-container
    commands:
      - type: console
        # we are using the '>' here to make a multiline command easier to read 
        # in yaml but be *run* as a single command on a single line
        command: > 
            USAGE_SCENARIO_DOMAIN=https://wagtail.org/ 
            node ./homepage-landing.js
        shell: sh
        log-stdout: True
        read-sci-stdout: True
        read-notes-stdout: True
```

Once this is in shape, you need to register this with your measurement cluster.

You can do this with the node script below:

```
node register-with-gmt.js

// should return with { success: true }
```