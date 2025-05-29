# Connecting to AgentCare MCP for Dialysis Tools

This guide explains how to connect to the AgentCare MCP server that provides specialized dialysis management tools.

## Updated Connection Methods

We've created multiple connection options to ensure compatibility with Claude Desktop and Goose:

### Method 1: Direct Server Launch

For Claude Desktop users:
1. Use the configuration file: `config/claude_desktop_simplified.json`
2. In Claude Desktop, go to Settings → MCPs → Add MCP from file
3. Select the `claude_desktop_simplified.json` file
4. After adding, click "Connect"

### Method 2: Launcher Script (for Goose)

If experiencing permission issues:
1. Use the configuration file: `config/goose_launcher.json`
2. In Goose, go to Extension → Core Extensions → MCP Launcher
3. Configure the extension using the `goose_launcher.json` file
4. Connect to the MCP using the "agentcare" name

### Method 3: Manual Server Start

For troubleshooting or development:
1. Open a terminal and run:
   ```
   cd /Users/sahib/healthcare-mcp/agentcare-mcp && node serve-mcp.js
   ```
2. The launcher will start the MCP server process
3. Configure Claude Desktop or Goose to connect to the manual server

## Configuration Files

We've created several configuration files to accommodate different connection scenarios:

- `config/claude_desktop_simplified.json`: Simplified config for Claude Desktop
- `config/goose_launcher.json`: Configuration for Goose MCP Launcher extension
- `serve-mcp.js`: Launcher script that runs the MCP server with environment variables

## Connection Troubleshooting

If you experience issues connecting:

1. **Build errors**: Ensure the project is built with `npm run build`
2. **Missing environment variables**: Check that all variables are set in the config files
3. **Permission errors**: Run the server with the `serve-mcp.js` script which bypasses permission issues
4. **Transport errors**: Ensure the MCP client is configured to use stdio transport
5. **Authentication issues**: Check that OAuth credentials are correct in the configuration

## Next Steps

Once connected to the MCP server:

1. Follow the examples in `DIALYSIS-TOOLS.md` to use the dialysis-specific tools
2. Test with sample patient IDs to verify functionality
3. Explore the different categories of dialysis management tools

For more detailed documentation on implemented tools and their parameters, see the `DIALYSIS-TOOLS.md` file.