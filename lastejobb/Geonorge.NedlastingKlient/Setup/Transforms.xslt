<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:wix="http://schemas.microsoft.com/wix/2006/wi">

  <xsl:output method="xml" indent="yes" />

  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

  <!-- Remove debug files -->
  <xsl:key name="service-search" match="wix:Component[contains(wix:File/@Source, '.pdb')]" use="@Id" />
  <xsl:template match="wix:Component[key('service-search', @Id)]" />
  <xsl:template match="wix:ComponentRef[key('service-search', @Id)]" />
  
  <!-- Add program shortcut -->
  <xsl:template
    match="wix:Component[wix:File[contains(@Source, 'Geonorge.Nedlaster.exe') and not(contains(@Source, '.config'))]]">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()" />
      <wix:Shortcut Id="ApplicationConsoleStartMenuShortcut"
                    Advertise="yes"
                    Directory="ApplicationProgramsFolder"
                    Name="Geonorge - nedlaster"
                    Icon="Geonorge.ico"
                    WorkingDirectory="INSTALLFOLDER_CONSOLE"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template
    match="wix:Component[wix:File[contains(@Source, 'Geonorge.MassivNedlasting.exe') and not(contains(@Source, '.config'))]]">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()" />
      <wix:Shortcut Id="ApplicationGuiStartMenuShortcut"
                    Advertise="yes"
                    Directory="ApplicationProgramsFolder"
                    Name="Geonorge - massiv nedlasting"
                    Icon="Geonorge.ico"
                    WorkingDirectory="INSTALLFOLDER_GUI"/>

      <wix:RemoveFolder Id="RemoveApplicationProgramsFolder" Directory="ApplicationProgramsFolder" On="uninstall" />
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>