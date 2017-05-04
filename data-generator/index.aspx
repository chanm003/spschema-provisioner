<%@ Page language="C#" MasterPageFile="~masterurl/default.master"    Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=15.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" meta:progid="SharePoint.WebPartPage.Document"  %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Import Namespace="Microsoft.SharePoint" %> <%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderUtilityContent" runat="server">
	<!--
		Not needed if masterpage already has jQuery or Lodash (i.e. $ or _ ) 
	-->
	<script type="text/javascript" src="jquery.min.js"></script>
	<script type="text/javascript" src="lodash.min.js"></script>
	<script type="text/javascript" src="spschema-provisioner.js"></script>
	
	<!--
		OPTIONAL:
		chance is library used to generate random values for fake test data 
	-->
	<script type="text/javascript" src="chance.min.js"></script>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
	<h2>Usage</h2>
	<p>
		<ol>
			<li>Hit F12</li>
			<li>
				Paste in snippets of code into console and hit Enter
				<ul>
					<li>
				Your snippets should leverage window.spSchemaProvisioner, which exposes two methods (both will return a jQuery promise):
				<ul>
					<li>
						generateDataStore
					</li>
					<li>
						insertListItems
					</li>
				</ul>
			</li>
				</ul>
			</li>
		</ol>
	</p>
	
	<h2>Where to Find the Snippets</h2>
	<h3>
		In the examples 'data-generator/examples' folder.  Feel free to copy+paste into Console and use as boilerplate for your own schema provisioning needs.
	</h3>
	<br/>
	<h2>Sample Snippet: Generating List(s)</h2>
	
	<h3>Following snippet creates two lists, four columns and a lookup relationship</h3>
	<p>
	<img src="examples/generate-lists-snippet.PNG"/>	
	</p>
	
	<h2>Sample Snippet: Generating List Items(s)</h2>
	
	<h3>Following snippet creates one list item in parent list and three items in child listsp</h3>
	<p>
	<img src="examples/generate-listitems-snippet.PNG"/>	
	</p>

	
</asp:Content>
